/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from 'react';
import TestContext from './TestContext';

const Parent = ({ children }: any) => {
  console.log('Parent Component Render');
  const { setCount } = useContext(TestContext);
  return (
    <div>
      <p>这里是父组件</p>
      {children}
      <button
        onClick={() => {
          setCount((preCount: number) => ++preCount);
        }}
      >
        点我+1
      </button>
    </div>
  );
};
export default Parent;
