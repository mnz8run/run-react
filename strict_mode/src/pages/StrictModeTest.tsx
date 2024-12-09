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
      canvas.width = 70;
      canvas.height = 30;
      const context = canvas.getContext('2d');
      if (context) {
        context.strokeRect(0, 0, 70, 30);
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText('C 1', 35, 15);
      }
      parentNode?.appendChild(canvas);
      return canvas;
    }

    drawCanvas(parentRef.current);
  }, []);

  return <div ref={parentRef}></div>;
}

/**
 * 增加 cleanup
 */
function FixWay1() {
  // vite 热更新会执行 useEffect
  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function drawCanvas(parentNode: HTMLElement | null) {
      const canvas = document.createElement('canvas');
      canvas.width = 70;
      canvas.height = 30;
      const context = canvas.getContext('2d');
      if (context) {
        context.strokeRect(0, 0, 70, 30);
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText('C 1', 35, 15);
      }
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

/**
 * 只在第一次加载执行
 */
function FixWay2() {
  // vite 热更新会执行 useEffect
  const firstRun = useRef(true);
  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function drawCanvas(parentNode: HTMLElement | null) {
      const canvas = document.createElement('canvas');
      canvas.width = 70;
      canvas.height = 30;
      const context = canvas.getContext('2d');
      if (context) {
        context.strokeRect(0, 0, 70, 30);
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText('C 1', 35, 15);
      }
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

/**
 * callback ref
 */
function FixWay3() {
  // vite 热更新会增加 canvas
  const drawCallBack = useCallback((target: HTMLDivElement) => {
    const canvas = document.createElement('canvas');
    canvas.width = 70;
    canvas.height = 30;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.strokeRect(0, 0, 70, 30);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('C 1', 35, 15);
    }
    target?.appendChild(canvas);
  }, []);

  return <div ref={drawCallBack} />;
}
