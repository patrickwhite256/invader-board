import React, { Component } from 'react';
import './InvaderSteps.css';
import InvaderDeck from './InvaderDeck.js';
import InvaderCard from './InvaderCard.js';


class InvaderSteps extends Component {
  constructor(props) {
    super(props);

    this.state = {
      deck: <InvaderDeck sequence={props.sequence} />,
      discard: [],
      build: <InvaderCard isNull={true} />,
      ravage: <InvaderCard isNull={true} />,
      activePhase: '',
    };

    this.deck = <InvaderDeck sequence={props.sequence} />;
  };

  setActivePhase(phase) {
    const prevPhase = this.state.phase;

    this.setState({activePhase: phase});

    if(phase === 'Explore') {
      this.deck.flipTop();
    }

    if(prevPhase === 'Explore') {
      this.advance();
    };
  };

  advance() {
    if (!this.state.ravage.isNull) {
      this.state.discard.push(this.state.ravage);
    }

    var newRavage = null;
    if (!this.state.build.isNull) {
      newRavage = this.state.build;
    }

    var newBuild = this.state.deck.pop();
    this.setState({ravage: newRavage, build: newBuild});
  };

  render() {
    var ravageClass = 'invader-card-holder';
    var buildClass = 'invader-card-holder';
    var exploreClass = 'invader-card-holder';
    switch(this.state.activePhase) {
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

    return <div className='invader-steps vertical-center'>
      <div className={ravageClass}>
      Ravage
      {this.state.ravage}
      </div>
      <div className={buildClass}>
      Build
      {this.state.build}
      </div>
      <div className={exploreClass}>
      Explore 
      {this.state.deck}
      </div>
    </div>
  };
}

export default InvaderSteps;
