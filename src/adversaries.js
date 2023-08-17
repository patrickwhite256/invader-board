const _ = require('lodash');

export const invaderDeckModifications = {
  'none': {},
  'SWE': {},
  'ENG': {},
  'BP': {
    2: (deck) => {
      // When making the Invader Deck, put 1 of the Stage III cards between Stage I and Stage II.
      const lastS3Index = _.findLastIndex(deck, (card) => card.stage === 3);
      const card = deck.splice(lastS3Index, 1)[0];
      const lastS1Index = _.findLastIndex(deck, (card) => card.stage === 1);
      deck.splice(lastS1Index + 1, 0, card);
    },
    3: (deck) => {
      // When making the Invader Deck, remove an additional Stage I card.
      const firstS1Index = _.findIndex(deck, (card) => card.stage === 1);
      deck.splice(firstS1Index, 1);
    },
    4: (deck) => {
      // When making the Invader Deck, remove an additional Stage II card.
      const firstS2Index = _.findIndex(deck, (card) => card.stage === 2);
      deck.splice(firstS2Index, 1);
    },
    5: (deck) => {
      // When making the Invader Deck, remove an additional Stage I card.
      const firstS1Index = _.findIndex(deck, (card) => card.stage === 1);
      deck.splice(firstS1Index, 1);
    },
    6: (deck) => {
      // When making the Invader Deck, remove all Stage I cards.
      _.remove(deck, (card) => card.stage === 1);
    },
  },
  'FRA': {},
  'HLC': {
    3: (deck) => {
      // When making the Invader Deck, Remove 1 additional Stage I Card.
      const firstS1Index = _.findIndex(deck, (card) => card.stage === 1);
      deck.splice(firstS1Index, 1);
    },
  },
  'SCO': {
    2: (deck) => {
      // Place "Coastal Lands" as the 3rd Stage II card, and move the two Stage II Cards above it up by one.
      let thirdS2Index = 0;
      let s2cardsFound = 0;
      for (let i = 0; i < deck.length; i++ ){
        if (deck[i].stage === 2) s2cardsFound++;
        if (s2cardsFound === 3) {
          thirdS2Index = i;
          break;
        }
      }

      const usedS2Cards = deck.filter(c => c.stage === 2).map(c => c.cardID);
      if (usedS2Cards.includes('C')) {
        const coastIndex = _.findIndex(deck, c => c.cardID === 'C');
        [deck[coastIndex], deck[thirdS2Index]] = [deck[thirdS2Index], deck[coastIndex]];
        deck[coastIndex].flipped = true;
      } else {
        deck[thirdS2Index].cardID = 'C';
        deck[thirdS2Index].flipped = true;
      }

      let boostedS2Cards = 0;
      for (let i = 0; i < deck.length; i++ ){
        if (deck[i].stage === 2) {
          [deck[i], deck[i-1]] = [deck[i-1], deck[i]];
          boostedS2Cards++;
          if (boostedS2Cards === 2) break;
        }
      }
    },
    4: (deck) => {
      // During Setup, replace the bottom Stage I Card with the bottom Stage III Card.
      const lastS1Index = _.findLastIndex(deck, (card) => card.stage === 1);
      const lastS3Index = _.findLastIndex(deck, (card) => card.stage === 3);

      if (lastS1Index === -1) return;

      deck[lastS1Index] = deck.splice(lastS3Index, 1)[0];
    },
  },
  'RUS': {
    4: (deck) => {
      for (let i = 0; i < deck.length; i++ ){
        if (deck[i].stage === 2) {
          const lastS3Index = _.findLastIndex(deck, (card) => card.stage === 3);
          deck.splice(i+1, 0, deck.splice(lastS3Index, 1)[0]);
        }
      }
    },
  },
};

function applyFlag(phaseName, flagName) {
  return (phases) => {
    const phaseIndex = _.findIndex(phases, (phase) => phase.name === phaseName);
    phases[phaseIndex].flags.push(flagName);
  }
}

export const phaseModifications = {
  'none': {},
  'SWE': {
    1: applyFlag('Ravage', 'SWE'),
  },
  'ENG': {
    1: applyFlag('Build', 'ENG'),
    3: (phases) => {
      const ravageIndex = _.findIndex(phases, (phase) => phase.name === 'Ravage');
      phases.splice(ravageIndex, 0, {name: 'High Immigration', flags: ['ENG']});
    },
  },
  'BP': {},
  'FRA': {
    1: applyFlag('Ravage', 'FRA'),
    4: applyFlag('Build', 'FRA'),
    6: (phases) => {
      const exploreIndex = _.findIndex(phases, (phase) => phase.name === 'Explore');
      phases.splice(exploreIndex+1, 0, {name: 'Persistent Explorers', flags: ['FRA']});
    },
  },
  'HLC': {
    1: (phases) => {
      const buildIndex = _.findIndex(phases, (phase) => phase.name === 'Build');
      phases.splice(buildIndex+1, 0, {name: 'Migratory Herders', flags: ['HLC']});
    },
    2: applyFlag('Build', 'HLC'),
    6: applyFlag('Ravage', 'HLC'),
  },
  'SCO': {
    1: applyFlag('Explore', 'SCO'),
    3: applyFlag('Build', 'SCO'),
    5: applyFlag('Ravage', 'SCO'),
    6: (phases) => {
      const ravageIndex = _.findIndex(phases, (phase) => phase.name === 'Ravage');
      phases.splice(ravageIndex+1, 0, {name: 'Exports Fuel Inward Growth', flags: ['SCO']});
    },
  },
  'RUS': {
    1: applyFlag('Ravage', 'RUS'),
    6: (phases) => {
      const ravageIndex = _.findIndex(phases, (phase) => phase.name === 'Ravage');
      phases.splice(ravageIndex+1, 0, {name: 'Pressure for Fast Profit', flags: ['RUS']});
    },
  },
};

export const extraFearCards = {
  'none': {},
  'BP': {
    1: [0, 0, 0],
    2: [0, 0, 0],
    3: [0, 1, 0],
    4: [1, 1, 0],
    5: [1, 1, 0],
    6: [1, 1, 1],
  },
  'ENG': {
    1: [0, 1, 0],
    2: [1, 1, 0],
    3: [1, 2, 1],
    4: [1, 2, 2],
    5: [1, 2, 2],
    6: [1, 2, 1],
  },
  'SWE': {
    1: [0, 0, 0],
    2: [0, 1, 0],
    3: [0, 1, 0],
    4: [0, 1, 1],
    5: [1, 1, 1],
    6: [1, 1, 2],
  },
  'FRA': {
    1: [0, 0, 0],
    2: [0, 1, 0],
    3: [1, 1, 0],
    4: [1, 1, 1],
    5: [1, 2, 1],
    6: [1, 2, 2],
  },
  'HLC': {
    1: [0, 1, 0],
    2: [1, 2, -1],
    3: [1, 2, 0],
    4: [1, 2, 0],
    5: [1, 3, 0],
    6: [2, 3, 0],
  },
  'RUS': {
    1: [0, 0, 1],
    2: [1, 0, 1],
    3: [1, 1, 0],
    4: [1, 1, 1],
    5: [1, 2, 1],
    6: [2, 2, 1],
  },
  'SCO': {
    1: [0, 1, 0],
    2: [1, 1, 0],
    3: [1, 2, 1],
    4: [2, 2, 1],
    5: [2, 3, 1],
    6: [3, 3, 1],
  },
};

export function disableHighImmigration(state) {
  return Object.assign({}, state, {
    highImmigrationEnabled: false,
    phases: state.phases.filter(phase => phase.name !== 'High Immigration'),
    phase: state.phase - 1,
  });
}
