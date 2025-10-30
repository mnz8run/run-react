import axios from 'axios';
import { channel, END, eventChannel } from 'redux-saga';
import { all, call, cancel, cancelled, fork, join, put, race, select, take } from 'redux-saga/effects';
import { uploadFile } from '@/services';
import { nsStore } from '../nonSerializableStore';
import { batchBackgroundRequestActions } from '../reducers/batchBackgroundRequestSlice';
import type { AnyAction, Channel, Task } from 'redux-saga';
import type { RootState } from '../reducers';
import type { Batch, ProgressInfo, RequestItem } from '../reducers/batchBackgroundRequestSlice';

interface Api {
  (...args: any[]): Promise<any>;
}

/** 
## Redux 不建议存储不可序列化数据
Redux 要求状态可序列化，主要原因：
- 时间旅行调试：Redux DevTools 需要序列化状态
- 状态持久化：需要将状态保存到 localStorage
- 服务端渲染：需要在服务器和客户端之间传递状态
- 可预测性：序列化数据更容易追踪和调试
 */
const apiMap: Record<string, Api> = { uploadFile };

const MAX_CONCURRENT_REQUESTS = 3;

const { setUploadStatus, updateUploadProgress, cancelUpload, cancelBatch, addBatch, retryUpload } = batchBackgroundRequestActions;

function* runApi(api: Api, onProgress: (progress: ProgressInfo) => void, apiParmas?: any[]) {
  const source = axios.CancelToken.source();
  const chan = eventChannel<ProgressInfo | Error>((emitter) => {
    const config = {
      onUploadProgress: (progressEvent: any) => {
        const loaded = progressEvent.loaded;
        const total = progressEvent.total;
        const percentCompleted = Math.round((loaded * 100) / total);
        emitter({ percent: percentCompleted, loaded, total });
      },
      cancelToken: source.token,
    };

    api(...(apiParmas ?? []), config)
      .then(() => {
        emitter({ percent: 100 });
        emitter(END);
      })
      .catch((err) => {
        if (!axios.isCancel(err)) {
          emitter(new Error(err.message));
        }
        emitter(END);
      });

    return () => {
      source.cancel();
    };
  });

  try {
    while (true) {
      const result: ProgressInfo | Error = yield take(chan);
      if (result instanceof Error) {
        throw result;
      }
      if (typeof result?.percent === 'number') {
        yield call(onProgress, result);
      }
    }
  } finally {
    const wasCancelled: boolean = yield cancelled();
    if (wasCancelled) {
      chan.close();
    }
  }
}

function* runApiSaga(requestItem: RequestItem) {
  let requestTask: Task | null = null;
  const apiKey = requestItem.apiKey;
  const api = apiMap?.[apiKey];
  if (!api) {
    throw new Error('Task failed to find the API.');
  }
  try {
    const requestItemId = requestItem.id;
    yield put(setUploadStatus({ requestItemId: requestItemId, status: 'uploading' }));
    const file = nsStore.getFile(requestItemId);

    requestTask = yield fork(
      runApi,
      api,
      function* (progress: ProgressInfo) {
        yield put(updateUploadProgress({ progress, requestItemId }));
      },
      [...(file ? [file] : []), ...(requestItem.apiParmas ?? [])]
    );

    if (!requestTask) {
      throw new Error('Task failed to fork.');
    }

    const { cancelSignal } = yield race({
      taskResult: join(requestTask),
      cancelSignal: take((action: AnyAction) => action.type === cancelUpload.type && action.payload.requestItemId === requestItemId),
    });

    if (cancelSignal) {
      yield cancel(requestTask);
    } else {
      yield put(setUploadStatus({ requestItemId, status: 'success' }));
      requestItem?.afterSuccess?.();
      nsStore.deleteFile(requestItemId);
    }
  } finally {
    const wasCancelled: boolean = yield cancelled();
    if (wasCancelled) {
      if (requestTask) {
        yield cancel(requestTask);
      }
    }
  }
}

function* worker(requestChannel: Channel<RequestItem>) {
  // 无限循环
  while (true) {
    // 从通道中取出一个任务，如果通道是空的，会在这里暂停等待
    const requestItem: RequestItem = yield take(requestChannel);
    try {
      // 检查文件状态，然后调用 runApiSaga 执行上传
      const latestRequestItemState: RequestItem | undefined = yield select((state: RootState) => {
        const batches = state?.batchBackgroundRequest?.batches;
        for (const batch of batches) {
          const found = batch.requestArray.find((ri) => ri.id === requestItem.id);
          if (found) {
            return found;
          }
        }
        return undefined;
      });

      if (latestRequestItemState && latestRequestItemState.status !== 'cancelled') {
        yield call(runApiSaga, requestItem);
      }
    } catch (error: any) {
      // 处理上传过程中抛出的错误
      if (!axios.isCancel(error)) {
        yield put(setUploadStatus({ requestItemId: requestItem.id, status: 'error', error: error.message }));
      }
    }
  }
}

function* watchCancelBatch() {
  while (true) {
    const { payload }: { payload: { batchId: string } } = yield take(cancelBatch.type);
    const batchToCancel: Batch | undefined = yield select((state: RootState) => {
      const batches = state?.batchBackgroundRequest?.batches;
      return batches.find((batch) => batch.id === payload.batchId);
    });

    if (batchToCancel) {
      // 取消批次，清除对应 nsStore 的数据，是这里触发的，巧合。
      yield all(batchToCancel.requestArray.map((requestItem) => put(cancelUpload({ requestItemId: requestItem.id }))));
    }
  }
}

type AddBatchAction = ReturnType<typeof addBatch>;
type RetryUploadAction = ReturnType<typeof retryUpload>;

function* watchActions(requestChannel: Channel<RequestItem>) {
  while (true) {
    // 等待 "添加文件" 或 "重试上传" 的动作
    const action: AddBatchAction | RetryUploadAction = yield take([addBatch.type, retryUpload.type]);
    if (action.type === addBatch.type) {
      for (const requestItem of action.payload.requestArray) {
        // 任务放到通道上
        yield put(requestChannel, requestItem);
      }
    } else if (action.type === retryUpload.type) {
      const { requestItemId } = action.payload;
      const requestItemToRetry: RequestItem | undefined = yield select((state: RootState) => {
        const batches = state?.batchBackgroundRequest?.batches;
        for (const batch of batches) {
          const found = batch.requestArray.find((ri) => ri.id === requestItemId);
          if (found) {
            return found;
          }
        }
        return undefined;
      });

      if (requestItemToRetry) {
        // 任务放到通道上
        yield put(requestChannel, requestItemToRetry);
      }
    }
  }
}

export function* watchBatchBackgroundRequest() {
  // 创建通道（空的），先进先出的任务队列
  const requestChannel: Channel<RequestItem> = yield call(channel);

  // 创建 MAX_CONCURRENT_REQUESTS 个 worker
  for (let i = 0; i < MAX_CONCURRENT_REQUESTS; i++) {
    yield fork(worker, requestChannel);
  }

  // 监听特定 action
  yield fork(watchActions, requestChannel);
  // 监听 整个批次的取消
  yield fork(watchCancelBatch);
}
