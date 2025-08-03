import { createSlice, configureStore } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0,
  },
  reducers: {
    incremented: (state) => {
      // Redux Toolkit 允许我们在 Reducer 中编写“可变”逻辑。它
      // 实际上并不会改变状态，因为它使用了 Immer 库，
      // 该库会检测“草稿状态”的变更，并基于这些变更生成一个全新的
      // 不可变状态
      state.value += 1;
    },
    decremented: (state) => {
      state.value -= 1;
    },
  },
});

export const { incremented, decremented } = counterSlice.actions;

const store = configureStore({
  reducer: counterSlice.reducer,
});

// 仍然可以订阅商店
store.subscribe(() => console.log(store.getState()));

// 仍然将动作对象传递给 `dispatch`，但它们是为我们创建的
store.dispatch(incremented());
// {value: 1}
store.dispatch(incremented());
// {value: 2}
store.dispatch(decremented());
// {value: 1}
