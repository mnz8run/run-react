import { ConfigProvider } from 'antd';
import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client';
import { App } from './app';
import store from './store';
import 'antd/dist/reset.css';
import './app.css';

const container = document.querySelector('#root') as Element;
const root = createRoot(container);

root.render(
  <>
    <Provider store={store}>
      <ConfigProvider theme={{ cssVar: true }}>
        <App />
      </ConfigProvider>
    </Provider>
  </>
);
