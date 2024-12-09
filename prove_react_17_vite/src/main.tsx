// import { StrictMode } from 'react';
import { render } from 'react-dom';
import { ReactBatching } from './pages/ReactBatching';
import { ReactBatchingClass } from './pages/ReactBatchingClass';

const container = document.getElementById('root');
const element = (
  <>
    {/* <StrictMode> */}
    <>react 17</>
    <ReactBatching />
    <ReactBatchingClass />
    {/* </StrictMode> */}
  </>
);

render(element, container);
