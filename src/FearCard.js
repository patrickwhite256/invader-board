import './FearCard.css';

function FearCard({isNull, cardID, flipped = false}) {
  let cardURL = 'fear_back.png';
  let className = "fear-card vertical-center";
  if (isNull) {
    className = "fear-card vertical-center hidden";
  } else if (flipped) {
    cardURL = `fear_cards/fear_${cardID}.png`;
  }
  return <img className={className} src={cardURL} alt={cardID} />;
}

export default FearCard;
