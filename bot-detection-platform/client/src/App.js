import HomePage from './pages/Home';
import BehaviorTracker from './utils/BehaviorTracker';

// Initialize behavior tracking on app load
const initializeTracking = () => {
  try {
    const tracker = new BehaviorTracker('http://localhost:5000');
    tracker.startTracking();
    window.botguardTracker = tracker;
    console.warn('[App] Behavior tracking initialized');
  } catch (error) {
    console.warn('[App] Error initializing behavior tracking:', error);
  }
};

export default function App() {
  // Initialize tracking
  if (typeof window !== 'undefined' && !window.botguardTracker) {
    initializeTracking();
  }
  
  return HomePage();
}
