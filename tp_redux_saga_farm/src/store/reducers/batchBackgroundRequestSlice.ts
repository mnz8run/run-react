import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction, Draft } from '@reduxjs/toolkit';

export interface Api {
  (...args: any[]): Promise<any>;
}

export interface ProgressInfo {
  percent: number;
  loaded?: number;
  total?: number;
}

export interface RequestItem {
  id: string;
  batchId: string;
  api: Api;
  apiParmas: any[];
  progress: ProgressInfo;
  status: 'pending' | 'uploading' | 'success' | 'error' | 'cancelled';
  error?: string;
  itemTitle?: string;
  afterSuccess?: () => void;
}

export interface Batch {
  id: string;
  minimized: boolean;
  requestArray: RequestItem[];
  afterDone?: () => void;
  afterSuccess?: () => void;
  windowTitle?: string;
  inPendingAndUploadingPopconfirmTitle?: string;
}

interface BatchBackgroundRequestState {
  batches: Batch[];
}

const initialState: BatchBackgroundRequestState = {
  batches: [],
};

const updateRequestItemInBatches = (state: Draft<BatchBackgroundRequestState>, requestItemId: string, update: Partial<RequestItem>) => {
  state.batches.forEach((batch) => {
    const requestItemIndex = batch.requestArray.findIndex((ri) => ri.id === requestItemId);
    if (requestItemIndex !== -1) {
      const requestItem = batch.requestArray[requestItemIndex];
      const newRequestItem = { ...requestItem, ...update, progress: { ...requestItem.progress, ...update?.progress } };
      batch.requestArray.splice(requestItemIndex, 1, newRequestItem);
    }
  });
};

interface SharedPayload {
  requestItemId: string;
}

const batchBackgroundRequestSlice = createSlice({
  name: 'batchBackgroundRequest',
  initialState,
  reducers: {
    addBatch: (state, action: PayloadAction<Omit<Batch, 'minimized'>>) => {
      const newBatch: Batch = {
        minimized: false,
        ...action.payload,
      };
      state.batches.push(newBatch);
    },
    updateUploadProgress: (state, action: PayloadAction<SharedPayload & Pick<RequestItem, 'progress'>>) => {
      const { progress, requestItemId } = action.payload;
      updateRequestItemInBatches(state, requestItemId, { progress });
    },
    setUploadStatus: (state, action: PayloadAction<SharedPayload & Pick<RequestItem, 'status' | 'error'>>) => {
      const { requestItemId, error, status } = action.payload;
      updateRequestItemInBatches(state, requestItemId, { error, status });
    },
    retryUpload: (state, action: PayloadAction<SharedPayload>) => {
      const { requestItemId } = action.payload;
      updateRequestItemInBatches(state, requestItemId, {
        status: 'pending',
        progress: { percent: 0 },
        error: undefined,
      });
    },
    cancelUpload: (state, action: PayloadAction<SharedPayload>) => {
      const { requestItemId } = action.payload;
      updateRequestItemInBatches(state, requestItemId, {
        status: 'cancelled',
      });
    },
    cancelBatch: (state, action: PayloadAction<{ batchId: string }>) => {
      const { batchId } = action.payload;
      const batch = state.batches.find((batch) => batch.id === batchId);
      if (batch) {
        const newRequestArray = batch.requestArray.map(
          (ri): RequestItem => (ri.status === 'pending' || ri.status === 'uploading' ? { ...ri, status: 'cancelled' } : ri)
        );
        batch.requestArray = newRequestArray;
      }
    },
    removeBatch: (state, action: PayloadAction<{ batchId: string }>) => {
      const { batchId } = action.payload;
      const batchIndex = state.batches.findIndex((batch) => batch.id === batchId);
      if (batchIndex !== -1) {
        state.batches.splice(batchIndex, 1);
      }
    },
    toggleBatchMinimization: (state, action: PayloadAction<{ batchId: string }>) => {
      const { batchId } = action.payload;
      const batchIndex = state.batches.findIndex((batch) => batch.id === batchId);
      if (batchIndex !== -1) {
        const batch = state.batches[batchIndex];
        const newBatch = { ...batch, minimized: !batch.minimized };
        state.batches.splice(batchIndex, 1, newBatch);
      }
    },
  },
});

export const batchBackgroundRequestReducer = batchBackgroundRequestSlice.reducer;

export const batchBackgroundRequestActions = batchBackgroundRequestSlice.actions;
