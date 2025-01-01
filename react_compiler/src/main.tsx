import { StrictMode } from 'react';
import { render } from 'react-dom';

const container = document.getElementById('root');
const element = (
  <>
    <StrictMode>
      <>react compiler</>
    </StrictMode>
  </>
);

render(element, container);
