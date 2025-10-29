import { combineReducers } from '@reduxjs/toolkit';
import { batchBackgroundRequestReducer } from './batchBackgroundRequestSlice';

export const rootReducer = combineReducers({
  batchBackgroundRequest: batchBackgroundRequestReducer,
});

// 在这里导出 RootState 可以解决循环依赖问题
export type RootState = ReturnType<typeof rootReducer>;
