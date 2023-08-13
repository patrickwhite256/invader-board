import { Toaster } from 'react-hot-toast';
import Board from './Board.js';

function App() {
  return (<>
    <Board />
    <Toaster
      position="bottom-center"
      toastOptions={{
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      }}
    />
  </>);
}

export default App;
