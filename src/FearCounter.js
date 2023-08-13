import React, { useContext } from 'react';
import GameContext from './GameContext.js';
import './FearCounter.css';
import toast from 'react-hot-toast';

function FearCounter({poolSize = 4}) {
  const { fear, setFear } = useContext(GameContext);

  const addFear = () => {
    if (fear === poolSize - 1) {
      toast('Fear card earned!');
    }

    setFear((fear + 1) % poolSize);
  };

  const removeFear = () => {
    if (fear === 0) {
      setFear(poolSize - 1);
    } else {
      setFear(fear - 1);
    }
  };

  return <div className='fear-container vertical-center'>
    <div className='fear-unearned' onClick={() => removeFear()}>{poolSize - fear}</div>
    <div className='fear-image' onClick={() => addFear()}><img src="/fear.webp" alt="fear"/></div>
    <div className='fear-earned' onClick={() => addFear()}>{fear}</div>
  </div>
}

export default FearCounter;
