import { createRef, useEffect, useRef } from 'react';
import InvaderCard from './InvaderCard.js'
import FearCard from './FearCard.js'
import './Card.css';

// TODO: export null cards

export function renderCard(card) {
  switch(card.type) {
    case 'invader':
      return <InvaderCard isNull={card.isNull} cardID={card.cardID} stage={card.stage} flipped={card.flipped} />;
    case 'fear':
      return <FearCard isNull={card.isNull} cardID={card.cardID} flipped={card.flipped} />
    case 'fear_divider':
      return <img className="tall-card" src={`terror_${card.level}.png`} alt={`terror level ${card.level}`}/>
    default:
      return null
  }
}

export function CardStack({cards}) {
  const stackRef = useRef(null);
  const cardElements = [];
  const cardRefs = [];
  for(let i = cards.length-1; i >= 0; i--) {
    const ref = createRef();
    cardElements.push(<div key={i} className="card-container" ref={ref}>{renderCard(cards[i])}</div>);
    cardRefs.push(ref);
  }

  useEffect(() => {
    if (cardRefs[0].length === 0) return;

    const cardWidth = cardRefs[0].current.offsetWidth;
    const stackWidth = stackRef.current.offsetWidth;
    for (let i = 0; i < cardRefs.length; i++) {
      cardRefs[i].current.style.left = (i * (stackWidth - cardWidth) / (cardRefs.length - 1)) + 'px';
    }
  });

  return <div className="card-stack" ref={stackRef}>{cardElements}</div>;
}
