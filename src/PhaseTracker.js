import React, { useContext } from 'react';
import './FearCounter.css';
import GameContext from './GameContext';
import './PhaseTracker.css';

const defaultPhases = [
  'Spirit',
  'Fast',
  'Blighted Island',
  'Event',
  'Fear',
  'Ravage',
  'Build',
  'Explore',
  'Slow',
];

export function PhaseTracker() {
  const { phase, setPhase } = useContext(GameContext);

  const phases = defaultPhases; // todo: allow more

  const advancePhase = () => {
    const currentPhaseN = phases.indexOf(phase);
    setPhase(phases[(currentPhaseN + 1) % phases.length]);
  };

  const phaseElements = [];

  for (var i = 0; i < phases.length; i++) {
    var className = 'phase';
    if (phases[i] === phase) {
      className = 'phase current-phase';
    }

    phaseElements.push(<div key={i} className={className}>{phases[i]}</div>);
  }

  return <div className='phase-tracker vertical-center' onClick={() => advancePhase()}>
    {phaseElements}
  </div>;
}

export default PhaseTracker;
