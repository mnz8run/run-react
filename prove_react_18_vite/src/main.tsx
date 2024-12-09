// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ReactBatching } from './pages/ReactBatching';
import { ReactBatchingClass } from './pages/ReactBatchingClass';

const container = document.getElementById('root')!;
const root = createRoot(container);
const children = (
  <>
    {/* <StrictMode> */}
    <>react 18</>
    <ReactBatching />
    <ReactBatchingClass />
    {/* </StrictMode> */}
  </>
);

root.render(children);
