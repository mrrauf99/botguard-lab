import HomePage from './pages/Home';
import ProductsPage from './pages/Products';
import ProductDetailPage from './pages/ProductDetail';
import BlogPage from './pages/Blog';
import ArticleDetailPage from './pages/ArticleDetail';
import ContactPage from './pages/Contact';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import Dashboard from './pages/Dashboard';
import SessionReplayPage from './pages/SessionReplay';
import BehaviorTracker from './utils/BehaviorTracker';
import DetectionClient from './utils/DetectionClient';
import DashboardSocket from './utils/DashboardSocket.js';
import NotificationManager from './utils/NotificationManager.js';
import { getApiUrl } from './utils/api.js';

const getPathname = () => (typeof window !== 'undefined' ? window.location.pathname : '/');

const initializeTracking = () => {
  try {
    const tracker = new BehaviorTracker(getApiUrl());
    tracker.startTracking();
    window.botguardTracker = tracker;
  } catch (error) {
    console.warn('[App] Error initializing behavior tracking:', error);
  }
};

const initializeDetection = () => {
  try {
    const client = new DetectionClient(getApiUrl());
    window.botguardDetection = client;
  } catch (error) {
    console.warn('[App] Error initializing detection client:', error);
  }
};

const initializeDashboardSocket = () => {
  try {
    const dashboardSocket = new DashboardSocket(getApiUrl());
    dashboardSocket.connect();
    dashboardSocket.loadDashboardData();
    dashboardSocket.setupAutoRefresh(30000);
    window.dashboardSocket = dashboardSocket;
  } catch (error) {
    console.warn('[App] Error initializing dashboard socket:', error);
  }
};

const initializeNotifications = () => {
  try {
    const notificationManager = new NotificationManager(getApiUrl());
    notificationManager.initialize();
    window.notificationManager = notificationManager;
  } catch (error) {
    console.warn('[App] Error initializing notification manager:', error);
  }
};

const resolvePage = (pathname) => {
  if (pathname.startsWith('/products/')) {
    return ProductDetailPage(pathname.split('/').pop());
  }
  if (pathname.startsWith('/blog/')) {
    return ArticleDetailPage(pathname.split('/').pop());
  }
  if (pathname.startsWith('/replay/')) {
    return SessionReplayPage(pathname.split('/').pop());
  }

  if (pathname.includes('/dashboard')) return Dashboard();
  if (pathname.includes('/products')) return ProductsPage();
  if (pathname.includes('/blog')) return BlogPage();
  if (pathname.includes('/contact')) return ContactPage();
  if (pathname.includes('/login')) return LoginPage();
  if (pathname.includes('/register')) return RegisterPage();

  return HomePage();
};

export default function App() {
  const pathname = getPathname();

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

    if (pathname.includes('/dashboard') && !window.dashboardSocket) {
      initializeDashboardSocket();
    }
  }

  return resolvePage(pathname);
}
