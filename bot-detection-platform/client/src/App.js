import HomePage from './pages/Home';
import Dashboard from './pages/Dashboard';
import BehaviorTracker from './utils/BehaviorTracker';
import DetectionClient from './utils/DetectionClient';
import DashboardSocket from './utils/DashboardSocket.js';
import NotificationManager from './utils/NotificationManager.js';

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

// Initialize dashboard socket on dashboard page
const initializeDashboardSocket = () => {
  try {
    const dashboardSocket = new DashboardSocket('http://localhost:5000');
    dashboardSocket.connect();
    dashboardSocket.loadDashboardData();
    dashboardSocket.setupAutoRefresh(30000); // Refresh every 30 seconds
    window.dashboardSocket = dashboardSocket;
    console.warn('[App] Dashboard socket initialized');
  } catch (error) {
    console.warn('[App] Error initializing dashboard socket:', error);
  }
};

// Initialize notification manager
const initializeNotifications = () => {
  try {
    const notificationManager = new NotificationManager('http://localhost:5000');
    notificationManager.initialize();
    window.notificationManager = notificationManager;
    console.warn('[App] Notification manager initialized');
  } catch (error) {
    console.warn('[App] Error initializing notification manager:', error);
  }
};

export default function App() {
  // Get current page from URL pathname
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';

  // Initialize tracking and detection
  if (typeof window !== 'undefined') {
    if (!window.botguardTracker) {
      initializeTracking();
    }
    if (!window.botguardDetection) {
      initializeDetection();
    }
    if (!window.notificationManager) {
      initializeNotifications();
    }
  }

  // Route to appropriate page
  if (pathname.includes('/dashboard')) {
    // Initialize dashboard socket only on dashboard page
    if (typeof window !== 'undefined' && !window.dashboardSocket) {
      initializeDashboardSocket();
    }
    return Dashboard();
  }

  return HomePage();
}
