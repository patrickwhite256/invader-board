import { useContext } from 'react';
import GameContext from './GameContext.js';
import { renderCard } from './Card.js';
import './EarnedFearCards.css';

function EarnedFearCards() {
  const { earnedFearCards } = useContext(GameContext);

  let card = {type: 'fear', isNull: true};
  if (earnedFearCards.length > 0) card = earnedFearCards[0];

  return <div className="earned-fear-cards">
    Earned: {earnedFearCards.length}
    <div className="earned-container">
      {renderCard(card)}
    </div>
  </div>
}

export default EarnedFearCards;
