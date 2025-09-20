import OpenCollection from './core/OpenCollection';
import './styles/App.css';
import { test } from './test';

function App() {
  const theme = 'dark';

  return (
    <div className="h-screen w-full">
      <OpenCollection
        collection={test}
        theme={theme}
      />
    </div>
  );
}

export default App;
