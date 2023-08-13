import arrayShuffle from 'array-shuffle';

const invaderCardsByStage = {
  1: ['W', 'J', 'M', 'S'],
  2: ['We', 'Je', 'Me', 'Se', 'C'],
  3: ['JS', 'JW', 'SM', 'SW', 'MJ', 'MW'],
};

export function buildDeck(sequence) {
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
        deck.push({stage: stageNumber, invaderCardID: invaderCardID, flipped: false});
        break;
    };
  };

  return deck;
}

function advanceCards({invaderDiscard, buildCard, ravageCard, setBuildCard, setRavageCard, invaderDeck}) {
  invaderDiscard.push(ravageCard);
  setRavageCard(buildCard);
  setBuildCard(invaderDeck.shift());
}

export function setPhase(gameContext, baseSetPhase) {
  return (newPhase) => {
    if(newPhase === 'Explore') {
      if(gameContext.invaderDeck.length > 0 ) {
        gameContext.invaderDeck[0].flipped = true;
      } // otherwise lose!
    }

    if(gameContext.phase === 'Explore') {
      advanceCards(gameContext.contextValue);
    }

    baseSetPhase(newPhase);
  }
}
