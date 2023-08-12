import React, { useState } from 'react';
import './FearCounter.css';

function FearCounter({poolSize = 4}) {
  let [earned, setEarned] = useState(0);

  const addFear = () => {
    earned = (earned + 1) % poolSize;

    setEarned(earned);
  };

  const removeFear = () => {
    if (earned === 0) {
      earned = poolSize - 1;
    } else {
      earned -= 1;
    }

    setEarned(earned);
  };

  return <div className='fear-container vertical-center'>
    <div className='fear-unearned' onClick={() => removeFear()}>{poolSize - earned}</div>
    <div className='fear-image' onClick={() => addFear()}><img src="/fear.webp" alt="fear"/></div>
    <div className='fear-earned' onClick={() => addFear()}>{earned}</div>
  </div>
}

export default FearCounter;
