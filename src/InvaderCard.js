import './InvaderCard.css';

function InvaderCard({isNull, stage, cardID, flipped = false}) {
  let cardURL = `/invader_s${stage}_back.png`;
  let className= 'invader-card';
  if (isNull) {
    cardURL = `invader_s1_back.png`;
    className = 'invader-card hidden';
  } else if (flipped) {
    cardURL = `/invader_${cardID}.png`;
  }

  return <img className={className} src={cardURL} alt={cardID} />
}

export default InvaderCard;

export function invaderCardComponentFromProps(card) {
  return <InvaderCard isNull={card.isNull} cardID={card.invaderCardID} stage={card.stage} flipped={card.flipped} />;
}
