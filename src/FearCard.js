import './FearCard.css';

function FearCard({cardID, flipped = false}) {
  let cardURL = 'fear_back.png';
  if (flipped) {
    cardURL = `fear_cards/fear_${cardID}.png`;
  }
  return <img className="fear-card vertical-center" src={cardURL} alt={cardID} />;
}

export default FearCard;
