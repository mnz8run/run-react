import { useState } from 'react';

// 关闭严格模式，看得更清晰
export function ReactBatching() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  // 整个 onClick 17 执行三次
  // Total 17: thrice
  //       18: twice
  function handleClick() {
    // re-render once
    setCount((c) => c + 1);
    setFlag((f) => !f);
    setTimeout(() => {
      // 17 这里会重新渲染两次
      setCount((c) => c + 1);
      setFlag((f) => !f);
    });
  }

  return (
    <div>
      <button onClick={handleClick}>Next</button>
      <h1 style={{ color: flag ? 'blue' : 'black' }}>{count}</h1>
    </div>
  );
}
