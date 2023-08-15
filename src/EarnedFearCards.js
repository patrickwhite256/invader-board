import { useContext } from 'react';
import { StateContext, StateDispatchContext } from './GameContext.js';
import { renderCard } from './Card.js';
import './EarnedFearCards.css';

function EarnedFearCards() {
  const { phase, phases, earnedFearCards } = useContext(StateContext)
  const dispatch = useContext(StateDispatchContext);

  let card = {type: 'fear', isNull: true, flipped: true};
  if (earnedFearCards.length > 0) card = earnedFearCards[0];

  const flipTop = () => {
    dispatch({type: 'flip_earned_fear_card'});
  };

  const resolveCard = () => {
    dispatch({type: 'resolve_earned_fear_card'});
  };

  const advancePhase = () => {
    dispatch({type: 'advance_phase'});
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
