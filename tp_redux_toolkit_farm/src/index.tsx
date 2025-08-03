import { createRoot } from 'react-dom/client';

const container = document.querySelector('#root') as Element;
const root = createRoot(container);

root.render(<></>);
