import OpenCollectionPlayground from './core/OpenCollectionPlayground';
import './styles/App.css';
import { test } from './test';

function App() {
  const theme = 'dark';

  return (
    <div className="h-screen w-full">
      <OpenCollectionPlayground
        collection={test}
        theme={theme}
        // proxyUrl="http://localhost:3001"
      />
    </div>
  );
}

export default App;
