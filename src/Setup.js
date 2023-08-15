import { useContext } from "react";
import { StateContext, StateDispatchContext} from './GameContext.js';

function Setup() {
  const state = useContext(StateContext);
  const dispatch = useContext(StateDispatchContext);

  const toggleExpansion = (e) => {
    dispatch({type: 'toggle_expansion', expansion: e.target.name});
  };

  const setup = () => {
    dispatch({type: 'setup_game'});
  };

  const setPlayerCount = (e) => {
    dispatch({type: 'set_player_count', playerCount: e.target.value});
  };

  const setAdversary = (e) => {
    dispatch({type: 'set_adversary', adversary: e.target.value});
  };

  const setAdversaryLevel = (e) => {
    dispatch({type: 'set_adversary_level', adversaryLevel: e.target.value});
  };

  return <div className="setup-container">
    <div>
      Expansions enabled:<br />
      <input type="checkbox" name="BC" checked={state.expansionsEnabled['BC']} onChange={toggleExpansion} /> Branch & Claw<br />
      <input type="checkbox" name="JE" checked={state.expansionsEnabled['JE']} onChange={toggleExpansion} /> Jagged Earth<br />
      <input type="checkbox" name="FF" checked={state.expansionsEnabled['FF']} onChange={toggleExpansion} /> Feather and Flame<br />
    </div>
    <div>
      Adversary: <select value={state.adversary} onChange={setAdversary}>
        <option value="none">None</option>
        <option value="BP">Brandenburg-Prussia</option>
        <option value="SWE">Sweden</option>
        <option value="ENG">England</option>
      </select>
      <span hidden={state.adversary === 'none'}>
        <br />
        Level: <select value={state.adversaryLevel} onChange={setAdversaryLevel}>
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
        </select>
      </span>
    </div>
    <div>
      Player count: <select value={state.playerCount} onChange={setPlayerCount}>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
      </select>
    </div>
    <div className="button-container" onClick={setup}>
      <span className="button">Start</span>
    </div>
  </div>;

}

export default Setup;
