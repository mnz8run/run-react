import React, { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';

function Batching() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);
  useEffect(() => {
    console.log('render');
  });

  function handleClick() {
    // re-render once
    setCount((c) => c + 1);
    setFlag((f) => !f);
    setTimeout(() => {
      // 18 re-render once at the end
      // before re-render twice
      setCount((c) => c + 1);
      setFlag((f) => !f);
    });
    // Total 17:thrice
    //       18:twice

    flushSync(() => {
      setCount((c) => c + 1);
    }); // React has updated the DOM by now

    flushSync(() => {
      setFlag((f) => !f);
    }); // React has updated the DOM by now
  }

  return (
    <div>
      <button onClick={handleClick}>Next</button>
      <h1 style={{ color: flag ? 'blue' : 'black' }}>{count}</h1>
    </div>
  );
}

export default Batching;
