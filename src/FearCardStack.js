import { useContext } from 'react';
import GameContext from './GameContext.js';
import { renderCard } from './Card.js';
import './FearCardStack.css';

function FearCardStack() {
  const { fearDeck } = useContext(GameContext);

  const fearCards = [];
  for (let i = 2; i >= 0; i--) {
    if (fearDeck[i].length === 0) continue;

    for (let j = fearDeck[i].length - 1; j >= 0; j--) {
      const card = renderCard(fearDeck[i][j]);
      const shouldHaveDivider = j === 0 && i !== 0 && fearDeck[i-1].length > 0;
      if (shouldHaveDivider) {
        fearCards.push(<div key={`${i}_${j}`} className="fear-card-container vertical-center">
          {card}
          <img className="fear-divider vertical-center" src={`terror_${i+1}.png`} alt="terror"/>
        </div>);
      } else {
        fearCards.push(<div key={`${i}_${j}`} className="fear-card-container vertical-center">
          {card}
        </div>);
      }
    }
  }

  return <div className="fear-stack">
    {fearCards}
  </div>;
}

export default FearCardStack;
