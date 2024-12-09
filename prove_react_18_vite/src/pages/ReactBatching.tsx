import { useState } from "react";
// import { flushSync } from 'react-dom';

/**
 * 关闭严格模式，看得更清晰
 *
 * https://github.com/reactwg/react-18/discussions/21
 *
 * https://react.dev/blog/2022/03/08/react-18-upgrade-guide
 */
export function ReactBatching() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  // 整个 onClick 18 执行三次
  // Total 17: thrice
  //       18: twice
  function handleClick() {
    // re-render once
    setCount((c) => c + 1);
    setFlag((f) => !f);
    setTimeout(() => {
      // 18 这里只重新渲染一次，之前会重新渲染两次
      // 18 re-render once at the end
      // before re-render twice
      setCount((c) => c + 1);
      setFlag((f) => !f);
    });
  }

  // This is a breaking change, but we expect this to result in less work rendering,
  // and therefore better performance in your applications.
  // To opt-out of automatic batching, you can use flushSync:
  //
  // 这是一项重大更改，但我们希望这能减少渲染工作量，
  // 从而提高应用程序的性能。
  // 要退出自动批处理，您可以使用 flushSync：
  // function handleFlushSyncClick() {
  //   // React has updated the DOM by now
  //   flushSync(() => {
  //     setCounter((c) => c + 1);
  //   });
  //   // React has updated the DOM by now
  //   flushSync(() => {
  //     setFlag((f) => !f);
  //   });
  // }

  return (
    <div>
      <button onClick={handleClick}>Next</button>
      <h1 style={{ color: flag ? "blue" : "black" }}>{count}</h1>
    </div>
  );
}

// Before React 18 only React events were batched
// React will only re-render once at the end (that's batching!)
// React will render twice, once for each state update (no batching)

// After React 18 updates inside of timeouts, promises,
// native event handlers or any other event are batched.
// React will only re-render once at the end (that's batching!)
// React will only re-render once at the end (that's batching!)

// 在 React 18 之前，只有 React 事件是批处理的
// React 只会在最后重新渲染一次（这就是批处理！）
// React 将渲染两次，每次状态更新一次（无批处理）

// 在 React 18 之后，超时、承诺、
// 原生事件或任何其他事件内的更新都是批处理的。
// React 只会在最后重新渲染一次（这就是批处理！）
// React 只会在最后重新渲染一次（这就是批处理！）
