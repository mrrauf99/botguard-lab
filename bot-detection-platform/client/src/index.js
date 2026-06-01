import './styles/global.css';
import './styles/components.css';
import './styles/notifications.css';
import App from './App';
import { initializeNotificationCenter, updateNotificationBadge, addNotificationItem } from './components/NotificationCenter.js';

const root = document.getElementById('root');
if (root) {
  // Simple rendering for now - components are JavaScript functions
  const html = App();
  if (html) {
    root.innerHTML = html;

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
