import React from 'react';
import { useRoutes } from 'react-router-dom';
import routes from '../config/routes';

const App: React.FC = () => {
  let element = useRoutes(routes);
  return (
    <div>
      <h1>Route Objects Example</h1>
      {element}
    </div>
  );
};

export default App;
