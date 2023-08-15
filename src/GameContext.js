import { createContext } from 'react';

const defaultState = {
  invaderDeck: [],
  setInvaderDeck: () => {},
  phase: '',
  setPhase: () => {},
  fear: 0,
  setFear: () => {},
  buildCard: null,
  setBuildCard: () => {},
  ravageCard: null,
  setRavageCard: () => {},
  invaderDiscard: [],
  setInvaderDiscard: () => {},
};

const GameContext = createContext(defaultState);

export const StateContext = createContext({});
export const StateDispatchContext = createContext({});

export default GameContext;
