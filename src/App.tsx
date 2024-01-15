import { useState } from 'react';
import TestContext from './TestContext';
import './App.css';
import Parent from './Parent';
import Borther from './Borther';
import Child from './Child';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <TestContext.Provider value={{ count, setCount }}>
        <Parent>
          <Borther />
          <Child />
        </Parent>
      </TestContext.Provider>
    </>
  );
}

export default App;
