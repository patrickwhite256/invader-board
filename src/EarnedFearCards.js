import { useContext } from 'react';
import GameContext from './GameContext.js';
import { renderCard } from './Card.js';
import './EarnedFearCards.css';

function EarnedFearCards() {
  const { advancePhase, phase, phases, earnedFearCards, setEarnedFearCards, setFearDiscard } = useContext(GameContext);

  let card = {type: 'fear', isNull: true, flipped: true};
  if (earnedFearCards.length > 0) card = earnedFearCards[0];

  const flipTop = () => {
    const newEarnedFearCards = [...earnedFearCards];
    newEarnedFearCards[0].flipped = true;
    setEarnedFearCards(newEarnedFearCards);
  };

  const resolveCard = () => {
    setEarnedFearCards(earnedFearCards.slice(1));
    setFearDiscard(fearDiscard => [...fearDiscard, earnedFearCards[0]]);
  };

  return <div className="earned-fear-cards">
    <div>
      Earned: {earnedFearCards.length}
    </div>
    <div className="earned-container">
      {renderCard(card)}
    </div>
    <div className="button-container">
      <span className="button" hidden={phases[phase].name !== 'Fear' || card.flipped === true} onClick={flipTop}>Flip</span>
      <span className="button" hidden={phases[phase].name !== 'Fear' || card.isNull === true || card.flipped === false} onClick={resolveCard}>Resolve</span>
      <span className="button" hidden={phases[phase].name !== 'Fear' || !card.isNull} onClick={advancePhase}>Advance</span>
    </div>
  </div>
}

export default EarnedFearCards;
