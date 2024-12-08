import { StrictMode } from 'react';
import { render } from 'react-dom';

const container = document.getElementById('root');
const element = (
  <StrictMode>
    <>react 17</>
  </StrictMode>
);

render(element, container);
