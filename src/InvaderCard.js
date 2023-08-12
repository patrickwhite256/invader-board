import React, { Component } from 'react';
import './InvaderCard.css';

class InvaderCard extends Component {
  constructor(props) {
    super(props);

    this.stage = props.stage;
    this.invaderCardID = props.invaderCardID;
    if (props.isNull) {
      this.isNull = props.isNull;
      this.stage = 1;
    }

    this.state = {
      flipped: false,
    };
  };

  flipUp() {
    this.setState({flipped: true});
  };

  cardFrontURL() {
    return `/invader_${this.invaderCardID}.png`;
  };

  cardBackURL() {
    return `/invader_s${this.stage}_back.png`;
  };

  render() {
    if (this.isNull) {
      return <img className="invader-card hidden" src={this.cardBackURL()} alt={this.invaderCardID}/>
    }

    var imageURL = this.cardBackURL();
    if (this.state.flipped) {
      imageURL = this.cardFrontURL();
    }

    return <img className="invader-card" src={imageURL} alt={this.invaderCardID}/>
  };
};

export default InvaderCard;
