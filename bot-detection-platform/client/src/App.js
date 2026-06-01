import HomePage from './pages/Home';
import BehaviorTracker from './utils/BehaviorTracker';
import DetectionClient from './utils/DetectionClient';

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

// Initialize detection client on app load
const initializeDetection = () => {
  try {
    const client = new DetectionClient('http://localhost:5000');
    window.botguardDetection = client;
    console.warn('[App] Detection client initialized');
  } catch (error) {
    console.warn('[App] Error initializing detection client:', error);
  }
};

export default function App() {
  // Initialize tracking and detection
  if (typeof window !== 'undefined') {
    if (!window.botguardTracker) {
      initializeTracking();
    }
    if (!window.botguardDetection) {
      initializeDetection();
    }
  }

  return HomePage();
}
