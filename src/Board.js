import { useReducer, useEffect } from 'react';
import './Board.css';
import FearCounter from './FearCounter.js';
import Setup from './Setup.js';
import FearCardStack from './FearCardStack.js';
import InvaderSteps  from './InvaderSteps.js';
import PhaseTracker from './PhaseTracker.js';
import EarnedFearCards from './EarnedFearCards.js';
import { StateContext, StateDispatchContext } from './GameContext';
import * as logic from './game_logic.js';
import { toast } from 'react-hot-toast';

const nPages = 2;


function Board() {
  const [state, dispatch] = useReducer(logic.stateReducer, {
    adversary: 'none',
    adversaryLevel: '0',
    expansionsEnabled: {
      'Base': true,
      'BC': true,
      'JE': true,
      'FF': true,
    },
    playerCount: '1',
    toastQueue: [],
    setupComplete: false,
  });

  const nextPage = () => {
    if (state.activePage < nPages - 1) dispatch({type: 'set_page', page: state.activePage + 1});
  };

  const prevPage = () => {
    if (state.activePage > 0) dispatch({type: 'set_page', page: state.activePage - 1});
  };

  useEffect(() => {
    if (state.toastQueue.length === 0) return;

    toast(state.toastQueue[0]);
    dispatch({type: 'toast_finished'});
  });

  let contents = <Setup />;
  if(state.setupComplete) {
    contents = <div className="game-container">
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
    </div>;
  }

  return (
    <StateContext.Provider value={state}>
      <StateDispatchContext.Provider value={dispatch} >
        <div className="invader-board">
          {contents}
        </div>
      </StateDispatchContext.Provider>
    </StateContext.Provider>
  );
}

export default Board;
