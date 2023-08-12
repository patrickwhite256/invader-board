import './App.css';
import FearCounter from './FearCounter.js';
import InvaderSteps from './InvaderSteps.js';
import PhaseTracker from './PhaseTracker.js';

function App() {
  const sequence = '111222233333';

  const invaderSteps = <InvaderSteps sequence={sequence} />;

  const advancePhase = function(phase) {
    // invaderSteps.setActivePhase(phase);
  };

  return (
    <div className="App">
      <FearCounter />
      {invaderSteps}
      <PhaseTracker advancePhaseCallback={advancePhase}  />
    </div>
  );
}

export default App;
