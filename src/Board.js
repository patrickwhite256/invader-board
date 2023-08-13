import { useState } from 'react';
import './Board.css';
import FearCounter from './FearCounter.js';
import InvaderSteps  from './InvaderSteps.js';
import PhaseTracker from './PhaseTracker.js';
import GameContext from './GameContext';
import { buildDeck, setPhase } from './game_logic.js';


function Board() {
  const sequence = '111222233333';
  const sequencedDeck = () => { return buildDeck(sequence); }

  const [fear, setFear] = useState(0);
  const [phase, baseSetPhase] = useState('Spirit');
  const [invaderDeck, setInvaderDeck] = useState(sequencedDeck);
  const [buildCard, setBuildCard] = useState({isNull: true});
  const [ravageCard, setRavageCard] = useState({isNull: true});
  const [invaderDiscard, setInvaderDiscard] = useState([]);

  const gameContext = {
    fear, setFear,
    phase, setPhase: baseSetPhase,
    invaderDeck, setInvaderDeck,
    buildCard, setBuildCard,
    ravageCard, setRavageCard,
    invaderDiscard, setInvaderDiscard,
  };

  gameContext.setPhase = setPhase(gameContext, baseSetPhase);

  return (
    <GameContext.Provider value={gameContext}>
      <div className="invader-board">
        <FearCounter />
        <InvaderSteps />
        <PhaseTracker />
      </div>
    </GameContext.Provider>
  );
}

export default Board;
