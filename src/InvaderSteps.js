import React, { useContext } from 'react';
import './InvaderSteps.css';
import { renderCard } from './Card.js';
import { StateContext } from './GameContext.js';

function InvaderSteps() {
  const { phase, phases, ravageCard, buildCard, invaderDeck } = useContext(StateContext)

  var ravageClass = 'invader-card-holder';
  var buildClass = 'invader-card-holder';
  var exploreClass = 'invader-card-holder';
  switch(phases[phase].name) {
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

  var exploreCard = renderCard({type:'invader', isNull: true});
  if (invaderDeck.length > 0) {
    exploreCard = renderCard(invaderDeck[0]);
  }

  return <div className='invader-steps vertical-center'>
    <div className={ravageClass}>
    Ravage
    {renderCard(ravageCard)}
    </div>
    <div className={buildClass}>
    Build
    {renderCard(buildCard)}
    </div>
    <div className={exploreClass}>
    Explore
    {exploreCard}
    </div>
  </div>
}

export default InvaderSteps;
