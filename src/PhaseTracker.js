import React, { useContext } from 'react';
import './FearCounter.css';
import GameContext from './GameContext';
import './PhaseTracker.css';

export function PhaseTracker() {
  const { phase, phases, advancePhase } = useContext(GameContext);

  const phaseElements = [];

  for (var i = 0; i < phases.length; i++) {
    var className = 'phase';
    if (i === phase) {
      className = 'phase current-phase';
    }

    phaseElements.push(<div key={i} className={className}>{phases[i].name}</div>);
  }

  return <div className='phase-tracker vertical-center' onClick={() => advancePhase()}>
    {phaseElements}
  </div>;
}

export default PhaseTracker;
