import { useContext } from 'react';
import TestContext from './TestContext';

const Child = () => {
  const { count } = useContext(TestContext);
  console.log('count: ', count);
  return <div>这里是子组件,count: {count}</div>;
};

export default Child;
