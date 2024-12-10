import { useEffect, useState } from 'react';

export function Countdown() {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count > 0) {
      const timeoutID = setTimeout(() => {
        setCount((prevCount) => {
          return prevCount - 1;
        });
      }, 1000);

      return () => {
        clearTimeout(timeoutID);
      };
    }
  }, [count]);

  return (
    <button onClick={() => setCount((count) => count + 1)}>
      count is {count}
    </button>
  );
}
