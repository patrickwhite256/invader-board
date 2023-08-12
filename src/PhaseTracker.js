import React, { Component } from 'react';
import './FearCounter.css';
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

class PhaseTracker extends Component {
  constructor(props) {
    super(props);

    this.phases = defaultPhases;
    this.advancePhaseCallback = props.advancePhaseCallback;

    this.state = {
      currentPhase: 0,
    };
  };

  advancePhase() {
    const phase = (this.state.currentPhase + 1) % this.phases.length;

    this.setState({currentPhase: phase});

    this.advancePhaseCallback(this.phases[phase]);
  }

  render() {
    const phases = [];

    for (var i = 0; i < this.phases.length; i++) {
      var className = 'phase';
      if (this.state.currentPhase === i) {
        className = 'phase current-phase';
      }

      phases.push(<div key={i} className={className}>{this.phases[i]}</div>);
    }

    return <div className='phase-tracker vertical-center' onClick={() => this.advancePhase()}>
      {phases}
    </div>;
  };
}

export default PhaseTracker;
