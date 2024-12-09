import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowFunctionClassProperties,
  ArrowFunctionInJSX,
  BindInJSX,
  ConstructorBind,
} from './pages/ClassComponent';

const container = document.getElementById('root')!;
const root = createRoot(container);
const children = (
  <StrictMode>
    <>react continuous</>
    <div>
      <ArrowFunctionClassProperties />
      <ConstructorBind />
      <ArrowFunctionInJSX />
      <BindInJSX />
    </div>
  </StrictMode>
);

root.render(children);
