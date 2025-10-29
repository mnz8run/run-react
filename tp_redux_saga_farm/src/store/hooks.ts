/**
 * fork https://github.com/reduxjs/redux-templates/blob/master/packages/rtk-app-structure-example/src/app/hooks.ts
 */

// This file serves as a central hub for re-exporting pre-typed Redux hooks.
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from './';
import type { RootState } from './reducers';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
