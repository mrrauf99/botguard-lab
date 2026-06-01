import SimulatorPage from './pages/Simulator.js';
import SimulatorManager from './components/SimulatorManager.js';

export default function App() {
  const simulatorManager = SimulatorManager();

  // Render app
  const appContainer = document.getElementById('root');
  if (!appContainer) return;

  appContainer.innerHTML = SimulatorPage();

  // Initialize simulator manager
  simulatorManager.initialize();

  // Expose globally for debugging
  window.simulatorManager = simulatorManager;
}
