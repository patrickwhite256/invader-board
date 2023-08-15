import { useContext } from 'react';
import './FearCard.css';
import OverlayContext from './OverlayContext.js';

function FearCard({isNull, cardID, flipped = false}) {
  const { setOverlayImage } = useContext(OverlayContext);

  let cardURL = 'fear_back.png';
  let className = "fear-card vertical-center";
  let onClick = undefined;
  if (isNull) {
    className = "fear-card vertical-center hidden";
  } else if (flipped) {
    cardURL = `fear_cards/fear_${cardID}.png`;
    onClick = () => { setOverlayImage(cardURL); }
  }
  return <img className={className} src={cardURL} onClick={onClick} alt={cardID} />;
}

export default FearCard;
