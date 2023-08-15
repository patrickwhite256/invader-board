import { useReducer, useEffect } from 'react';
import './Board.css';
import FearCounter from './FearCounter.js';
import FearCardStack from './FearCardStack.js';
import InvaderSteps  from './InvaderSteps.js';
import PhaseTracker from './PhaseTracker.js';
import EarnedFearCards from './EarnedFearCards.js';
import { StateContext, StateDispatchContext } from './GameContext';
import * as logic from './game_logic.js';
import { toast } from 'react-hot-toast';

const nPages = 2;


function Board() {
  // things that will be configurable evantually
  const sequence = '111222233333';
  const expansionsEnabled = ['Base', 'JE', 'BC', 'FF'];
  const countsByStage = [3, 3, 3];
  const startingPoolSize = 4;
  const startingPhases = [
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

  const [state, dispatch] = useReducer(logic.stateReducer, {
    activePage: 0,
    fear: 0,
    poolSize: startingPoolSize,
    phase: 0,
    phases: startingPhases,
    invaderDeck: logic.buildInvaderDeck(sequence),
    buildCard: {type:'invader', isNull: true},
    ravageCard: {type:'invader', isNull: true},
    invaderDiscard: [],
    fearDeck: logic.buildFearDeck(expansionsEnabled, countsByStage),
    fearDiscard: [],
    earnedFearCards: [],
    toastQueue: [],
  });

  const nextPage = () => {
    if (state.activePage < nPages - 1) dispatch({type: 'set_page', page: state.activePage + 1});
  };

  const prevPage = () => {
    if (state.activePage > 0) dispatch({type: 'set_page', page: state.activePage - 1});
  };

  useEffect(() => {
    console.log('getting warm');
    if (state.toastQueue.length === 0) return;
    console.log("oh it's TOASTY");

    toast(state.toastQueue[0]);
    dispatch({type: 'toast_finished'});
  });

  return (
    <StateContext.Provider value={state}>
      <StateDispatchContext.Provider value={dispatch} >
        <div className="invader-board">
          <div className="top-box" onClick={prevPage}><img className="up-arrow" src="chevron_up.svg" hidden={state.activePage === 0} alt="up"/></div>
          <div className="invader-board-container" hidden={state.activePage !== 0} >
            <FearCounter />
            <InvaderSteps />
            <PhaseTracker />
          </div>
          <div className="invader-board-container" hidden={state.activePage !== 1} >
            <FearCounter />
            <FearCardStack />
            <EarnedFearCards />
          </div>
          <div className="bottom-box" onClick={nextPage}><img className="down-arrow" src="chevron_up.svg" hidden={state.activePage === nPages - 1} alt="down"/></div>
        </div>
      </StateDispatchContext.Provider>
    </StateContext.Provider>
  );
}

export default Board;
