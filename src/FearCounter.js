import React, { useContext } from 'react';
import { StateContext, StateDispatchContext } from './GameContext.js';
import './FearCounter.css';

function FearCounter() {
  const { poolSize, fear } = useContext(StateContext)
  const dispatch = useContext(StateDispatchContext);

  const addFear = () => {
    dispatch({type: 'add_fear', delta: 1});
  };

  const removeFear = () => {
    dispatch({type: 'add_fear', delta: -1});
  };

  return <div className='fear-container vertical-center'>
    <div className='fear-unearned' onClick={() => removeFear()}>{poolSize - fear}</div>
    <div className='fear-image' onClick={() => addFear()}><img src="fear.webp" alt="fear"/></div>
    <div className='fear-earned' onClick={() => addFear()}>{fear}</div>
  </div>
}

export default FearCounter;
