import { useState } from 'react';

// 关闭严格模式，看得更清晰
export function ReactBatching() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);
  function handleClick() {
    // 这里 setCount, setFlag 合成一次 re-render
    setCount((c) => c + 1);
    setFlag((f) => !f);
    setTimeout(() => {
      // 17 setCount, setFlag 各一次 re-render, 18 后就合成一次了
      setCount((c) => c + 1);
      setFlag((f) => !f);
    });
  }
  // 17: thrice re-render
  // 18: twice  re-render
  console.log('AQUILA re-render');
  return (
    <div>
      <button onClick={handleClick}>Next</button>
      <h1 style={{ color: flag ? 'blue' : 'black' }}>{count}</h1>
    </div>
  );
}
