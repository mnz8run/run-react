import { all } from 'redux-saga/effects';
import { watchBatchBackgroundRequest } from './batchBackgroundRequest';

export function* rootSaga() {
  yield all([watchBatchBackgroundRequest()]);
}
