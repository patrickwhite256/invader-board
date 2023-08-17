import './InvaderCard.css';

function InvaderCard({isNull, stage, cardID, flipped = false}) {
  let cardURL = `invader_cards/invader_s${stage}_back.png`;
  let className= 'tall-card';
  if (isNull) {
    cardURL = `invader_cards/invader_s1_back.png`;
    className = 'tall-card hidden';
  } else if (flipped) {
    cardURL = `invader_cards/invader_${cardID}.png`;
  }

  return <img className={className} src={cardURL} alt={cardID} />
}

export default InvaderCard;
