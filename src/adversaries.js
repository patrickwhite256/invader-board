const _ = require('lodash');

export const invaderDeckModifications = {
  'none': {},
  'SWE': {},
  'ENG': {},
  'BP': {
    2: (deck) => {
      const lastS3Index = _.findLastIndex(deck, (card) => card.stage === 3);
      const card = deck.splice(lastS3Index, 1)[0];
      const lastS1Index = _.findLastIndex(deck, (card) => card.stage === 1);
      deck.splice(lastS1Index + 1, 0, card);
    },
    3: (deck) => {
      const firstS1Index = _.findIndex(deck, (card) => card.stage === 1);
      deck.splice(firstS1Index, 1);
    },
    4: (deck) => {
      const firstS2Index = _.findIndex(deck, (card) => card.stage === 2);
      deck.splice(firstS2Index, 1);
    },
    5: (deck) => {
      const firstS1Index = _.findIndex(deck, (card) => card.stage === 1);
      deck.splice(firstS1Index, 1);
    },
    6: (deck) => {
      _.remove(deck, (card) => card.stage === 1);
    },
  },
};

function applyFlag(phases, phaseName, flagName) {
    const phaseIndex = _.findIndex(phases, (phase) => phase.name === phaseName);
    phases[phaseIndex].flags.push(flagName);
}

export const phaseModifications = {
  'none': {},
  'SWE': {
    1: (phases) => { applyFlag(phases, 'Ravage', 'SWE') },
  },
  'ENG': {
    1: (phases) => { applyFlag(phases, 'Build', 'ENG') },
    3: (phases) => {
      const ravageIndex = _.findIndex(phases, (phase) => phase.name === 'Ravage');
      phases.splice(ravageIndex, 0, {name: 'High Immigration', flags: ['ENG']});
    },
  },
  'BP': {},
};

export function disableHighImmigration(state) {
  return Object.assign({}, state, {
    highImmigrationEnabled: false,
    phases: state.phases.filter(phase => phase.name !== 'High Immigration'),
    phase: state.phase - 1,
  });
}
