import React from 'react';
import { useRoutes } from 'react-router-dom';
import routes from '../config/routes';

const App: React.FC = () => {
  let element = useRoutes(routes);
  return element;
};

export default App;
