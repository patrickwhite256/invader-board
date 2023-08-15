import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Board from './Board.js';
import Overlay from './Overlay.js';
import OverlayContext from './OverlayContext.js';

function App() {
  const [overlayImage, setOverlayImage] = useState('');

  const overlayContext = {
    overlayImage, setOverlayImage,
  };

  return (<OverlayContext.Provider value={overlayContext} >
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
    <Overlay />
  </OverlayContext.Provider>);
}

export default App;
