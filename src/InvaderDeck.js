import React, { useContext } from 'react';
import InvaderCard, { invaderCardComponentFromProps } from './InvaderCard.js';
import './InvaderDeck.css';
import GameContext from './GameContext.js';


function InvaderDeck() {
  const { invaderDeck } = useContext(GameContext);

  if (invaderDeck.length > 0) {
    return invaderCardComponentFromProps(invaderDeck[0]);
  }

  return <InvaderCard isNull={true} />
}

export default InvaderDeck;
