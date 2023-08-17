import arrayShuffle from 'array-shuffle';
import { invaderDeckModifications, phaseModifications, disableHighImmigration, extraFearCards } from './adversaries.js';
const _ = require('lodash');

const defaultInvaderCards = '111222233333';
const defaultPhases = [
  {name: 'Spirit', flags: []},
  {name: 'Fast', flags: []},
  {name: 'Blighted Island', flags: []},
  {name: 'Event', flags: []},
  {name: 'Fear', flags: []},
  {name: 'Ravage', flags: []},
  {name: 'Build', flags: []},
  {name: 'Explore', flags: []},
  {name: 'Slow', flags: []},
];

const adversaries = ['BP', 'ENG', 'SWE', 'FRA', 'HLC', 'RUS', 'SCO'];

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

  remainingCardsByStage[1] = arrayShuffle(remainingCardsByStage[1]);
  remainingCardsByStage[2] = arrayShuffle(remainingCardsByStage[2]);
  remainingCardsByStage[3] = arrayShuffle(remainingCardsByStage[3]);

  const deck = [];
  for (var stage of sequence) {
    const stageNumber = parseInt(stage);
    const invaderCardID = remainingCardsByStage[stageNumber].pop();
    deck.push({type: 'invader', stage: stageNumber, cardID: invaderCardID, flipped: false});
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

  const terrorLevelCounts = [3, 3, 3];

  if (state.adversaryLevel > 0) {
    terrorLevelCounts[0] += extraFearCards[state.adversary][state.adversaryLevel][0];
    terrorLevelCounts[1] += extraFearCards[state.adversary][state.adversaryLevel][1];
    terrorLevelCounts[2] += extraFearCards[state.adversary][state.adversaryLevel][2];
  }

  return [
    ...fearDeck.slice(0, terrorLevelCounts[0]),
    {type:'fear_divider', level: 2},
    ...fearDeck.slice(terrorLevelCounts[0], terrorLevelCounts[0]+terrorLevelCounts[1]),
    {type:'fear_divider', level: 3},
    ...fearDeck.slice(terrorLevelCounts[0]+terrorLevelCounts[1], terrorLevelCounts[0]+terrorLevelCounts[1]+terrorLevelCounts[2]),
  ];
}

function advanceCards(state) {
  let updatedState = Object.assign({}, state, {
    invaderDiscard: [...state.invaderDiscard, ...state.ravageCards],
    ravageCards: state.buildCards,
    buildCards: [state.invaderDeck[0]],
    invaderDeck: state.invaderDeck.slice(1),
  });


  if (state.highImmigrationEnabled) {
    const anyRavageCardIsStage2 = state.ravageCards.reduce((anyStage2, card) => anyStage2 || card.stage === 2, false);
    if (state.adversaryLevel === 3 && anyRavageCardIsStage2) {
      updatedState.invaderDiscard = [...state.invaderDiscard, ...state.highImmigrationCards, ...state.ravageCards];
      updatedState = disableHighImmigration(updatedState);
    } else {
      updatedState.invaderDiscard = [...state.invaderDiscard, ...state.highImmigrationCards];
      updatedState.highImmigrationCards = state.ravageCards;
    }
  }

  if (updatedState.invaderDeck[0].type === 'hlc_reminder') {
    updatedState = toast(updatedState, 'Habsburg\'s Wave of Immigration: add city and towns');
    updatedState.invaderDeck.shift();
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
  earnedFearCards.push(fearDeck.shift());

  if (fearDeck.length === 0) {
    state = toast(state, 'Spirits win!');
  } else {
    state = toast(state, 'Fear card earned!');
    if (fearDeck[0].type === 'fear_divider') {
      state = toast(state, `Terror level ${fearDeck[0].level} achieved!`);
      fearDeck.shift();
    }
  }

  return Object.assign({}, state, {earnedFearCards, fearDeck});
}

// TODO: doesn't put back at right TL
function unearnFearCard(state) {
  const earnedFearCards = [...state.earnedFearCards];
  const fearDeck = _.cloneDeep(state.fearDeck);
  if (earnedFearCards.length === 0) return state;

  fearDeck.unshift(earnedFearCards.pop());

  state = toast(state, 'Fear card removed');
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
  const phases = _.cloneDeep(defaultPhases);

  for (let i = 0; i <= state.adversaryLevel; i++) {
    const mutator = phaseModifications[state.adversary][i];
    if (mutator) mutator(phases);
  }

  return phases;
}

function setupGame(state) {
  const updatedState = Object.assign({}, state);
  const playerCount = parseInt(state.playerCount);
  const adversaryLevel = parseInt(state.adversaryLevel);
  const toastQueue = [];

  if (updatedState.adversary === 'RNG') {
    updatedState.adversary = adversaries[_.random(adversaries.length)-1];
  }

  // invader cards setup
  const invaderDeck = buildInvaderDeck(updatedState);
  const invaderDiscard = [];

  if (updatedState.adversary === 'HLC' && adversaryLevel >= 5) {
    invaderDeck.splice(5, 0, {type:'hlc_reminder'});
  }

  const buildCards = [invaderDeck.shift()];
  buildCards[0].flipped = true;

  if (updatedState.adversary === 'SWE' && adversaryLevel >= 4) {
    const discarded = invaderDeck.shift();
    invaderDiscard.push(discarded);
    toastQueue.push(`Sweden discard: ${discarded.cardID}`);
  }

  let poolSize = 4 * playerCount;
  if (updatedState.adversary === 'ENG' && adversaryLevel === 6) poolSize = 5 * playerCount;

  let highImmigrationEnabled = false;
  if (updatedState.adversary === 'ENG' && adversaryLevel >= 3) highImmigrationEnabled = true;

  return Object.assign({}, updatedState, {
    activePage: 0,
    fear: 0,
    poolSize,
    phase: 0,
    phases: setupPhases(updatedState),
    invaderDeck,
    buildCards,
    ravageCards: [{type:'invader', isNull: true}],
    highImmigrationCards: [{type:'invader', isNull: true}],
    invaderDiscard,
    fearDeck: buildFearDeck(updatedState),
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
