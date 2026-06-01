import './styles/global.css';
import './styles/components.css';
import './styles/notifications.css';
import App from './App';
import { setupPageHandlers } from './utils/pageInit.js';
import { initSessionReplay } from './utils/sessionReplay.js';
import {
  initializeNotificationCenter,
  updateNotificationBadge,
  addNotificationItem,
} from './components/NotificationCenter.js';

const root = document.getElementById('root');
if (root) {
  // Simple rendering for now - components are JavaScript functions
  const html = App();
  if (html) {
    root.innerHTML = html;

    setupPageHandlers(window.location.pathname);

    if (window.location.pathname.includes('/dashboard')) {
      const token = localStorage.getItem('botguard_token');
      const hint = document.getElementById('dashboard-auth-hint');
      if (hint && !token) {
        hint.style.display = 'block';
      }
    }

    if (window.location.pathname.startsWith('/replay/')) {
      const sessionId = window.location.pathname.split('/').pop();
      initSessionReplay(sessionId);
    }

    // Initialize notification center UI
    initializeNotificationCenter();

    // Set up notification manager callbacks if available
    if (window.notificationManager) {
      window.notificationManager.on('notification', (notification) => {
        updateNotificationBadge(window.notificationManager.unreadCount);
        addNotificationItem(
          notification,
          (id) => window.notificationManager.markAsRead(id),
          (id) => window.notificationManager.deleteNotification(id)
        );
      });

      window.notificationManager.on('unreadChange', (count) => {
        updateNotificationBadge(count);
      });

      // Set up action buttons
      const markAllBtn = document.getElementById('mark-all-read-btn');
      if (markAllBtn) {
        markAllBtn.addEventListener('click', () => {
          window.notificationManager.markAllAsRead();
        });
      }

      const clearAllBtn = document.getElementById('clear-all-btn');
      if (clearAllBtn) {
        clearAllBtn.addEventListener('click', () => {
          window.notificationManager.clearAll();
          const list = document.getElementById('notification-list');
          if (list) {
            list.innerHTML = '<div class="notification-empty">No notifications</div>';
          }
        });
      }

      // Update badge on initial load
      updateNotificationBadge(window.notificationManager.unreadCount);
    }
  } else {
    root.innerHTML = '<h1>Bot Detection Platform</h1>';
  }
}
