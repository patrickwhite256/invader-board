import { useContext } from 'react';
import { StateContext } from './GameContext.js';
import { CardStack } from './Card.js';
import './FearCardStack.css';

function FearCardStack() {
  const { fearDeck } = useContext(StateContext)

  return <div className="fear-stack">
    <CardStack cards={fearDeck} />
  </div>;
}

export default FearCardStack;
