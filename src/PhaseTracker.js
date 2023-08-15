import React, { useContext } from 'react';
import './FearCounter.css';
import { StateContext, StateDispatchContext } from './GameContext.js';
import './PhaseTracker.css';

export function PhaseTracker() {
  const { phase, phases } = useContext(StateContext)
  const dispatch = useContext(StateDispatchContext);

  const advancePhase = () => {
    dispatch({type: 'advance_phase'});
  };

  const phaseElements = [];

  for (var i = 0; i < phases.length; i++) {
    var className = 'phase';
    if (i === phase) {
      className = 'phase current-phase';
    }

    phaseElements.push(<div key={i} className={className}>{phases[i].name}</div>);
  }

  return <div className='phase-tracker vertical-center' onClick={advancePhase}>
    {phaseElements}
  </div>;
}

export default PhaseTracker;
