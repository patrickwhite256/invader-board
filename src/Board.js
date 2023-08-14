import { useState } from 'react';
import './Board.css';
import FearCounter from './FearCounter.js';
import FearCardStack from './FearCardStack.js';
import InvaderSteps  from './InvaderSteps.js';
import PhaseTracker from './PhaseTracker.js';
import EarnedFearCards from './EarnedFearCards.js';
import GameContext from './GameContext';
import * as logic from './game_logic.js';

const nPages = 2;


function Board() {
  // things that will be configurable evantually
  const sequence = '111222233333';
  const expansionsEnabled = ['Base', 'JE', 'BC', 'FF'];
  const countsByStage = [3, 3, 3];
  const startingPoolSize = 4;

  const initInvaderDeck = () => { return logic.buildInvaderDeck(sequence); }
  const initFearDeck = () => {return logic.buildFearDeck(expansionsEnabled, countsByStage)};

  const [activePage, setActivePage] = useState(0);

  const [fear, baseSetFear] = useState(0);
  const [phase, baseSetPhase] = useState('Spirit');
  const [invaderDeck, setInvaderDeck] = useState(initInvaderDeck);
  const [buildCard, setBuildCard] = useState({isNull: true});
  const [ravageCard, setRavageCard] = useState({isNull: true});
  const [invaderDiscard, setInvaderDiscard] = useState([]);
  const [fearDeck, setFearDeck] = useState(initFearDeck);
  const [earnedFearCards, setEarnedFearCards] = useState([]);
  const [fearDiscard, setFearDiscard] = useState([]);
  const [poolSize, setPoolSize] = useState(startingPoolSize);

  const gameContext = {
    fear, setFear: baseSetFear,
    phase, setPhase: baseSetPhase,
    invaderDeck, setInvaderDeck,
    buildCard, setBuildCard,
    ravageCard, setRavageCard,
    invaderDiscard, setInvaderDiscard,
    fearDeck, setFearDeck,
    earnedFearCards, setEarnedFearCards,
    fearDiscard, setFearDiscard,
    poolSize, setPoolSize,
  };

  gameContext.setPhase = logic.setPhase(gameContext, baseSetPhase);
  gameContext.setFear = logic.setFear(gameContext, baseSetFear);

  const nextPage = () => {
    if (activePage < nPages - 1) setActivePage(activePage + 1);
  };

  const prevPage = () => {
    if (activePage > 0) setActivePage(activePage - 1);
  };

  return (
    <GameContext.Provider value={gameContext}>
      <div className="invader-board">
        <div className="top-box" onClick={prevPage}><img className="up-arrow" src="chevron_up.svg" hidden={activePage === 0} alt="up"/></div>
        <div className="invader-board-container" hidden={activePage !== 0} >
          <FearCounter />
          <InvaderSteps />
          <PhaseTracker />
        </div>
        <div className="invader-board-container" hidden={activePage !== 1} >
          <FearCounter />
          <FearCardStack />
          <EarnedFearCards />
        </div>
        <div className="bottom-box" onClick={nextPage}><img className="down-arrow" src="chevron_up.svg" hidden={activePage === nPages - 1} alt="down"/></div>
      </div>
    </GameContext.Provider>
  );
}

export default Board;
