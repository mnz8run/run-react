import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root')!;
const root = createRoot(container);
const children = (
  <StrictMode>
    <>react 18</>
  </StrictMode>
);

root.render(children);
