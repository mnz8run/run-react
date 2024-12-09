import { useCallback, useRef, useEffect } from 'react';

export function StrictModeTest() {
  return (
    <>
      <Exception />
      <FixWay1 />
      <FixWay2 />
      <FixWay3 />
    </>
  );
}

function Exception() {
  // 严格模式下有俩个 canvas
  // [vite] hot updated vite 热更新会有再次增加 canvas
  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function drawCanvas(parentNode: HTMLElement | null) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = 70;
      canvas.height = 30;
      context?.fillRect(10, 10, 100, 100);
      parentNode?.appendChild(canvas);
      return canvas;
    }

    drawCanvas(parentRef.current);
  }, []);

  return <div ref={parentRef}></div>;
}

function FixWay1() {
  // vite 热更新会执行 useEffect
  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function drawCanvas(parentNode: HTMLElement | null) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = 70;
      canvas.height = 30;
      context?.fillRect(10, 10, 100, 100);
      parentNode?.appendChild(canvas);
      return canvas;
    }

    const parentNode = parentRef.current;
    const canvasNode = drawCanvas(parentRef.current);

    return () => {
      parentNode?.removeChild(canvasNode);
    };
  }, []);

  return <div ref={parentRef}></div>;
}

function FixWay2() {
  // vite 热更新会执行 useEffect
  const firstRun = useRef(true);
  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function drawCanvas(parentNode: HTMLElement | null) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = 70;
      canvas.height = 30;
      context?.fillRect(10, 10, 100, 100);
      parentNode?.appendChild(canvas);
      return canvas;
    }

    if (firstRun.current) {
      drawCanvas(parentRef.current);
      firstRun.current = false;
    }
  }, []);

  return <div ref={parentRef}></div>;
}

function FixWay3() {
  // callback ref
  // vite 热更新会增加 canvas
  const drawCallBack = useCallback((target: HTMLDivElement) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 70;
    canvas.height = 30;
    ctx?.fillRect(10, 10, 100, 100);
    target?.appendChild(canvas);
  }, []);

  return <div ref={drawCallBack} />;
}
