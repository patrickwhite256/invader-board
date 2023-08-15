import arrayShuffle from 'array-shuffle';
import { invaderDeckModifications, phaseModifications, disableHighImmigration } from './adversaries.js';
const _ = require('lodash');

const defaultInvaderCards = '111222233333';
const defaultPhases = [
  {name: 'Spirit'},
  {name: 'Fast'},
  {name: 'Blighted Island'},
  {name: 'Event'},
  {name: 'Fear'},
  {name: 'Ravage'},
  {name: 'Build'},
  {name: 'Explore'},
  {name: 'Slow'},
];

const invaderCardsByStage = {
  1: ['W', 'J', 'M', 'S'],
  2: ['We', 'Je', 'Me', 'Se', 'C'],
  3: ['JS', 'JW', 'SM', 'SW', 'MJ', 'MW'],
};

const fearCardCounts = {
  'Base': 15,
  'BC': 15,
  'JE': 6,
  'FF': 5,
};

export function buildInvaderDeck(state) {
  const sequence = defaultInvaderCards;

  let remainingCardsByStage = {
    1: [...invaderCardsByStage[1]],
    2: [...invaderCardsByStage[2]],
    3: [...invaderCardsByStage[3]],
  };

  if (sequence.includes('C')) {
    remainingCardsByStage[2].pop();
  }

  remainingCardsByStage[1] = arrayShuffle(remainingCardsByStage[1]);
  remainingCardsByStage[2] = arrayShuffle(remainingCardsByStage[2]);
  remainingCardsByStage[3] = arrayShuffle(remainingCardsByStage[3]);

  const deck = [];
  for (var stage of sequence) {
    switch (stage) {
      case 'C':
        deck.push({stage: 2, invaderCardID: 'C'});
        break;
      default:
        const stageNumber = parseInt(stage);
        const invaderCardID = remainingCardsByStage[stageNumber].pop();
        deck.push({type: 'invader', stage: stageNumber, cardID: invaderCardID, flipped: false});
        break;
    };
  };

  for (let i = 0; i <= state.adversaryLevel; i++) {
    const mutator = invaderDeckModifications[state.adversary][i];
    if (mutator) mutator(deck);
  }

  return deck;
}

export function buildFearDeck(state) {
  let fearDeck = [];
  for (const expansion in fearCardCounts) {
    if (state.expansionsEnabled[expansion]) {
      for (let i = 0; i < fearCardCounts[expansion]; i++) {
        fearDeck.push({type:'fear', flipped: false, cardID:`${expansion}_${i}`});
      }
    }
  }

  fearDeck = arrayShuffle(fearDeck);

  return [
    fearDeck.slice(0, 3),
    fearDeck.slice(3, 6),
    fearDeck.slice(6, 9),
  ];
}

function advanceCards(state) {
  let updatedState = Object.assign({}, state, {
    invaderDiscard: [...state.invaderDiscard, state.ravageCard],
    ravageCard: state.buildCard,
    buildCard: state.invaderDeck[0],
    invaderDeck: state.invaderDeck.slice(1),
  });


  if (state.highImmigrationEnabled) {
    if (state.adversaryLevel === 3 && state.ravageCard.stage === 2) {
      updatedState.invaderDiscard = [...state.invaderDiscard, state.highImmigrationCard, state.ravageCard];
      updatedState = disableHighImmigration(updatedState);
    } else {
      updatedState.invaderDiscard = [...state.invaderDiscard, state.highImmigrationCard];
      updatedState.highImmigrationCard = state.ravageCard;
    }
  }

  return updatedState;
}

function toast(state, text) {
  return Object.assign({}, state, {toastQueue: [...state.toastQueue, text]});
}

function advancePhase(state) {
  let updatedState = Object.assign({}, state, {
    phase: (state.phase + 1) % state.phases.length,
  });

  const prevPhaseName = state.phases[state.phase].name;

  switch(prevPhaseName) {
    case 'Explore':
      updatedState = advanceCards(updatedState);
      break;
    case 'Fear':
      updatedState.activePage = 0;
      break;
    default:
  }

  const nextPhaseName = updatedState.phases[updatedState.phase].name;

  switch(nextPhaseName) {
    case 'Explore':
      if(updatedState.invaderDeck.length > 0 ) {
        const invaderDeck = _.cloneDeep(updatedState.invaderDeck);
        invaderDeck[0].flipped = true;
        updatedState.invaderDeck = invaderDeck;
      } else {
        updatedState = toast(updatedState, 'Invaders win!');
      }
      break;
    case 'Fear':
      if (updatedState.earnedFearCards.length > 0) {
        updatedState.activePage = 1;
      } else {
        updatedState.phase += 1;
        updatedState = toast(updatedState, `No fear cards; proceeding to ${updatedState.phases[updatedState.phase].name}`);
      }
      break;
    default:
  }

  return updatedState;
}

function earnFearCard(state) {
  const earnedFearCards = [...state.earnedFearCards];
  const fearDeck = _.cloneDeep(state.fearDeck);
  for(let i = 0; i < state.fearDeck.length; i++) {
    if (state.fearDeck[i].length > 0) {
      earnedFearCards.push(fearDeck[i].shift());
      if (fearDeck[i].length === 0) state = toast(state, `Terror level ${i+2} achieved!`);
      break;
    }
  }

  if (fearDeck[2].length === 0) state = toast(state, 'Spirits win!');
  else state = toast(state, 'Fear card earned!');

  return Object.assign({}, state, {earnedFearCards, fearDeck});
}

// TODO: doesn't always put back at right TL
function unearnFearCard(state) {
  const earnedFearCards = [...state.earnedFearCards];
  const fearDeck = _.cloneDeep(state.fearDeck);
  if (earnedFearCards.length === 0) return state;

  for(var i in fearDeck) {
    if (fearDeck[i].length > 0) {
      fearDeck[i].unshift(earnedFearCards.pop());
      break;
    }
  }

  toast(state, 'Fear card removed');
  return Object.assign({}, state, {earnedFearCards, fearDeck});
}

function setFear(state, delta) {
  let newFear = state.fear + delta;

  if (newFear === state.poolSize) {
    newFear = 0;
    state = earnFearCard(state);
  }

  if (newFear === -1) {
    newFear = state.poolSize - 1;
    state = unearnFearCard(state);
  }

  return Object.assign({}, state, {fear: newFear});
}

function setupPhases(state) {
  const phases = [...defaultPhases];

  for (let i = 0; i <= state.adversaryLevel; i++) {
    const mutator = phaseModifications[state.adversary][i];
    if (mutator) mutator(phases);
  }

  return phases;
}

function setupGame(state) {
  const playerCount = parseInt(state.playerCount);
  const adversaryLevel = parseInt(state.adversaryLevel);
  const toastQueue = [];

  // invader deck setup
  const invaderDeck = buildInvaderDeck(state);
  const invaderDiscard = [];

  if (state.adversary === 'SW' && adversaryLevel >= 4) {
    const discarded = invaderDeck.shift();
    invaderDiscard.push(discarded);
    toastQueue.push(`Sweden discard: ${discarded.cardID}`);
  }

  const buildCard = invaderDeck.shift();
  buildCard.flipped = true;

  let poolSize = 4 * playerCount;
  if (state.adversary === 'ENG' && adversaryLevel === 6) poolSize = 5 * playerCount;

  let highImmigrationEnabled = false;
  if (state.adversary === 'ENG' && adversaryLevel >= 3) highImmigrationEnabled = true;

  return Object.assign({}, state, {
    activePage: 0,
    fear: 0,
    poolSize,
    phase: 0,
    phases: setupPhases(state),
    invaderDeck,
    buildCard,
    ravageCard: {type:'invader', isNull: true},
    highImmigrationCard: {type:'invader', isNull: true},
    invaderDiscard,
    fearDeck: buildFearDeck(state),
    fearDiscard: [],
    earnedFearCards: [],
    setupComplete: true,
    playerCount,
    adversaryLevel,
    highImmigrationEnabled,
    toastQueue,
  });
}

export function stateReducer(state, action) {
  switch(action.type) {
    case 'flip_earned_fear_card':
      const earnedFearCards = [...state.earnedFearCards];
      earnedFearCards[0].flipped = true;
      return Object.assign({}, state, {earnedFearCards});
    case 'resolve_earned_fear_card':
      return Object.assign({}, state, {
        earnedFearCards: state.earnedFearCards.slice(1),
        fearDiscard: [...state.fearDiscard, state.earnedFearCards[0]],
      });
    case 'advance_phase':
      return advancePhase(state);
    case 'add_fear':
      return setFear(state, action.delta);
    case 'set_page':
      return Object.assign({}, state, {activePage: action.page});
    case 'toast_finished':
      return Object.assign({}, state, {toastQueue: state.toastQueue.slice(1)});
    // setup events
    case 'toggle_expansion':
      const expansionsEnabled = {...state.expansionsEnabled};
      expansionsEnabled[action.expansion] = !expansionsEnabled[action.expansion];
      return Object.assign({}, state, { expansionsEnabled });
    case 'set_player_count':
      return Object.assign({}, state, { playerCount: action.playerCount });
    case 'set_adversary':
      return Object.assign({}, state, { adversary: action.adversary });
    case 'set_adversary_level':
      return Object.assign({}, state, { adversaryLevel: action.adversaryLevel });
    case 'setup_game':
      return setupGame(state);
    default:
      return state;
  }
}
