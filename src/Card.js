import InvaderCard from './InvaderCard.js'
import FearCard from './FearCard.js'

export function renderCard(card) {
  switch(card.type) {
    case 'invader':
      return <InvaderCard isNull={card.isNull} cardID={card.cardID} stage={card.stage} flipped={card.flipped} />;
    case 'fear':
      return <FearCard isNull={card.isNull} cardID={card.cardID} flipped={card.flipped} />
    default:
      return null
  }
}
