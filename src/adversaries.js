const _ = require('lodash');

export const invaderDeckModifications = {
  'none': {},
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
