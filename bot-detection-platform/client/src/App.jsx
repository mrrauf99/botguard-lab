import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import AppRoutes from './routes/AppRoutes';
import BehaviorTracker from './utils/BehaviorTracker';
import DetectionClient from './utils/DetectionClient';
import { getApiUrl } from './services/api';
import { unlockNotificationAudio } from './utils/notificationSound';

export default function App() {
  useEffect(() => {
    const apiUrl = getApiUrl();

    if (!window.botguardTracker) {
      try {
        const tracker = new BehaviorTracker(apiUrl);
        tracker.startTracking();
        window.botguardTracker = tracker;
      } catch {
        /* tracking optional */
      }
    }

    if (!window.botguardDetection) {
      try {
        window.botguardDetection = new DetectionClient(apiUrl);
      } catch {
        /* detection optional */
      }
    }

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const unlockOnGesture = () => {
      unlockNotificationAudio();
    };
    window.addEventListener('click', unlockOnGesture, { once: true });
    window.addEventListener('keydown', unlockOnGesture, { once: true });

    return () => {
      window.removeEventListener('click', unlockOnGesture);
      window.removeEventListener('keydown', unlockOnGesture);
    };
  }, []);

  return (
    <AuthProvider>
      <NotificationProvider>
        <AppRoutes />
      </NotificationProvider>
    </AuthProvider>
  );
}
