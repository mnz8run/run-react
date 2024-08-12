import './App.css';
import Parent from './Parent';
import Borther from './Borther';
import Child from './Child';
import ContextWrapper from './ContextWrapper';

function App() {
  console.log('App Component Render');

  return (
    <>
      <ContextWrapper>
        <Parent>
          <Borther />
          <Child />
        </Parent>
      </ContextWrapper>
    </>
  );
}

export default App;
