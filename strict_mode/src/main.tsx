import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { StrictModeTest } from './pages/StrictModeTest';

const container = document.getElementById('root')!;
const root = createRoot(container);
const children = (
  <StrictMode>
    <>strict mode</>
    <StrictModeTest />
  </StrictMode>
);

root.render(children);
