import arrayShuffle from 'array-shuffle';
import { toast } from 'react-hot-toast';

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

export function buildInvaderDeck(sequence) {
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

  return deck;
}

export function buildFearDeck(expansionsEnabled, countsByStage) {
  let fearDeck = [];
  for (const expansion in fearCardCounts) {
    if (expansionsEnabled.includes(expansion)) {
      for (let i = 0; i < fearCardCounts[expansion]; i++) {
        fearDeck.push({type:'fear', flipped: false, cardID:`${expansion}_${i}`});
      }
    }
  }

  fearDeck = arrayShuffle(fearDeck);

  return [
    fearDeck.slice(0, countsByStage[0]),
    fearDeck.slice(countsByStage[0], countsByStage[0]+countsByStage[1]),
    fearDeck.slice(countsByStage[0]+countsByStage[1], countsByStage[0]+countsByStage[1]+countsByStage[2]),
  ];
}

function advanceCards({invaderDiscard, buildCard, ravageCard, setBuildCard, setRavageCard, invaderDeck}) {
  invaderDiscard.push(ravageCard);
  setRavageCard(buildCard);
  setBuildCard(invaderDeck.shift());
}

export function advancePhase(gameContext, baseSetPhase) {
  return () => {
    let newPhase = (gameContext.phase + 1) % gameContext.phases.length;

    const prevPhaseName = gameContext.phases[gameContext.phase].name;
    const nextPhaseName = gameContext.phases[newPhase].name;

    switch(prevPhaseName) {
      case 'Explore':
        advanceCards(gameContext);
        break;
      case 'Fear':
        gameContext.setActivePage(0);
        break;
      default:
    }

    switch(nextPhaseName) {
      case 'Explore':
        if(gameContext.invaderDeck.length > 0 ) {
          gameContext.invaderDeck[0].flipped = true;
        } else {
          toast('Invaders win!');
        }
        break;
      case 'Fear':
        if (gameContext.earnedFearCards.length > 0) {
          gameContext.setActivePage(1);
        } else {
          newPhase += 1;
          toast(`No fear cards; proceeding to ${gameContext.phases[newPhase].name}`);
        }
        break;
      default:
    }

    baseSetPhase(newPhase);
  };
}

export function setPhase(gameContext, baseSetPhase) {
  return (newPhase) => {
    if(newPhase === 'Explore') {
      if(gameContext.invaderDeck.length > 0 ) {
        gameContext.invaderDeck[0].flipped = true;
      } else {
        toast('Invaders win!');
      }
    }

    if(gameContext.phase === 'Explore') {
      advanceCards(gameContext);
    }

    baseSetPhase(newPhase);
  };
}

function earnFearCard(gameContext) {
  for(let i = 0; i < gameContext.fearDeck.length; i++) {
    if (gameContext.fearDeck[i].length > 0) {
      gameContext.earnedFearCards.push(gameContext.fearDeck[i].shift());
      if (gameContext.fearDeck[i].length === 0) toast(`Terror level ${i+2} achieved!`);
      break;
    }
  }

  if (gameContext.fearDeck[2].length === 0) return false

  return true;
}

// TODO: doesn't always put back at right TL
function unearnFearCard(gameContext) {
  if (gameContext.earnedFearCards.length === 0) return false;

  for(var i in gameContext.fearDeck) {
    if (gameContext.fearDeck[i].length > 0) {
      gameContext.fearDeck[i].unshift(gameContext.earnedFearCards.pop());
      break;
    }
  }

  return true;
}


export function setFear(gameContext, baseSetFear) {
  return (newFear) => {
    if (newFear === gameContext.poolSize) {
      newFear = 0;
      if (earnFearCard(gameContext)) {
        toast('Fear card earned!');
      } else {
        toast('Spirits win!');
      }
    }

    if (newFear === -1) {
      if (unearnFearCard(gameContext)) toast('Fear card removed');
      newFear = gameContext.poolSize - 1;
    }

    baseSetFear(newFear);
  };
}
