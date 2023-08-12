import React, { useContext } from 'react';
import './InvaderSteps.css';
import InvaderCard from './InvaderCard.js';
import { invaderCardComponentFromProps } from './InvaderCard.js';
import GameContext from './GameContext';

function InvaderSteps() {
  const { phase, ravageCard, buildCard, invaderDeck } = useContext(GameContext);

  var ravageClass = 'invader-card-holder';
  var buildClass = 'invader-card-holder';
  var exploreClass = 'invader-card-holder';
  switch(phase) {
    case 'Ravage':
      ravageClass = 'invader-card-holder active-phase';
      break;
    case 'Build':
      buildClass = 'invader-card-holder active-phase';
      break;
    case 'Explore':
      exploreClass = 'invader-card-holder active-phase';
      break;
    default:
  };

  var exploreCard = <InvaderCard isNull={true} />;
  if (invaderDeck.length > 0) {
    exploreCard = invaderCardComponentFromProps(invaderDeck[0]);
  }

  return <div className='invader-steps vertical-center'>
    <div className={ravageClass}>
    Ravage
    {invaderCardComponentFromProps(ravageCard)}
    </div>
    <div className={buildClass}>
    Build
    {invaderCardComponentFromProps(buildCard)}
    </div>
    <div className={exploreClass}>
    Explore
    {exploreCard}
    </div>
  </div>
}

export default InvaderSteps;
