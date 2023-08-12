import React, { Component } from 'react';
import arrayShuffle from 'array-shuffle';
import InvaderCard from './InvaderCard.js';
import './InvaderDeck.css';


const invaderCardsByStage = {
  1: ['W', 'J', 'M', 'S'],
  2: ['We', 'Je', 'Me', 'Se', 'C'],
  3: ['JS', 'JW', 'SM', 'SW', 'MJ', 'MW'],
};

class InvaderDeck extends Component {
  constructor(props) {
    super(props);

    if (props.sequence.includes('C')) {
      invaderCardsByStage[2].pop();
    }

    invaderCardsByStage[1] = arrayShuffle(invaderCardsByStage[1]);
    invaderCardsByStage[2] = arrayShuffle(invaderCardsByStage[2]);
    invaderCardsByStage[3] = arrayShuffle(invaderCardsByStage[3]);

    const deck = [];
    for (var stage of props.sequence) {
      switch (stage) {
        case 'C':
          deck.push(<InvaderCard stage={2} invaderCardID='C'/>);
          break;
        default:
          const stageNumber = parseInt(stage);
          const invaderCardID = invaderCardsByStage[stageNumber].pop();
          deck.push(<InvaderCard stage={stageNumber} invaderCardID={invaderCardID}/>);
          break;
      };
    };

    this.stage = props.stage;

    this.state = {
      deck: deck,
    };
  };

  pop() {
    return this.state.deck.shift();
  };

  flipTop() {
    if (this.deck.length > 0) {
      this.deck[0].flipUp();
    }
  };

  render() {
    if (this.state.deck.length > 0) {
      return this.state.deck[0]
    }

    return <InvaderCard isNull={true} />
  };
};

export default InvaderDeck;
