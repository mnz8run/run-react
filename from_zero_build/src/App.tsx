import { useRoutes } from 'react-router-dom';
import routes from '../config/routes';
import type { RouteObject } from 'react-router-dom';

const App = () => {
  let element = useRoutes(routes as RouteObject[]);
  return element;
};

export default App;
