import React, { useContext } from 'react';
import GameContext from './GameContext.js';
import './FearCounter.css';

function FearCounter() {
  const { poolSize, fear, setFear } = useContext(GameContext);

  const addFear = () => {
    setFear(fear + 1);
  };

  const removeFear = () => {
    setFear(fear-1);
  };

  return <div className='fear-container vertical-center'>
    <div className='fear-unearned' onClick={() => removeFear()}>{poolSize - fear}</div>
    <div className='fear-image' onClick={() => addFear()}><img src="/fear.webp" alt="fear"/></div>
    <div className='fear-earned' onClick={() => addFear()}>{fear}</div>
  </div>
}

export default FearCounter;
