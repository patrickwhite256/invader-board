import { useContext } from 'react';
import './Overlay.css';
import OverlayContext from './OverlayContext';

function Overlay() {
  const { overlayImage, setOverlayImage } = useContext(OverlayContext);

  const clearOverlay = () => {
    setOverlayImage('');
  };

  return <div className="overlay" hidden={overlayImage === ''} onClick={clearOverlay}>
    <div className="overlay-background" />
    <img src={overlayImage} alt="overlay" />
  </div>
}

export default Overlay;
