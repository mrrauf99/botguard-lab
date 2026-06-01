/**
 * Render notification center component
 */
export const renderNotificationCenter = () => {
  return `
    <div class="notification-center" id="notification-center">
      <div class="notification-header">
        <h3>Notifications</h3>
        <button class="notification-close-btn" id="notification-close">×</button>
      </div>
      <div class="notification-actions">
        <button class="notification-btn" id="mark-all-read-btn">Mark all as read</button>
        <button class="notification-btn secondary" id="clear-all-btn">Clear</button>
      </div>
      <div class="notification-list" id="notification-list">
        <div class="notification-empty">No notifications yet</div>
      </div>
    </div>

    <div class="notification-badge-container" id="notification-badge-container">
      <button class="notification-toggle-btn" id="notification-toggle">
        🔔
        <span class="notification-badge" id="notification-badge">0</span>
      </button>
    </div>
  `;
};

/**
 * Create notification item element
 */
const createNotificationItem = (notification, onMarkRead, onDelete) => {
  const item = document.createElement('div');
  item.className = `notification-item severity-${notification.severity} ${!notification.read ? 'unread' : ''}`;
  item.dataset.notificationId = notification._id;

  const timeAgo = getTimeAgo(new Date(notification.createdAt));

  const typeEmoji = {
    'bot-detected': '🤖',
    'session-ended': '⏹️',
    'high-risk': '⚠️',
    anomaly: '❓',
    system: 'ℹ️',
  };

  const emoji = typeEmoji[notification.type] || '📢';

  item.innerHTML = `
    <div class="notification-content">
      <div class="notification-header-row">
        <span class="notification-emoji">${emoji}</span>
        <span class="notification-title">${notification.title}</span>
        <span class="notification-time">${timeAgo}</span>
      </div>
      <div class="notification-message">${notification.message}</div>
      ${
        notification.data?.sessionId
          ? `<div class="notification-meta">Session: ${notification.data.sessionId.slice(0, 8)}...</div>`
          : ''
      }
    </div>
    <div class="notification-actions-row">
      ${
        !notification.read
          ? `<button class="notification-action-btn mark-read" data-id="${notification._id}">✓ Read</button>`
          : ''
      }
      <button class="notification-action-btn delete" data-id="${notification._id}">✕</button>
    </div>
  `;

  // Event listeners
  const markReadBtn = item.querySelector('.mark-read');
  if (markReadBtn) {
    markReadBtn.addEventListener('click', () => {
      onMarkRead(notification._id);
    });
  }

  const deleteBtn = item.querySelector('.delete');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
      onDelete(notification._id);
    });
  }

  return item;
};

/**
 * Get relative time string
 */
const getTimeAgo = (date) => {
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

/**
 * Update notification list
 */
export const updateNotificationList = (notifications, onMarkRead, onDelete) => {
  const list = document.getElementById('notification-list');
  if (!list) return;

  list.innerHTML = '';

  if (!notifications || notifications.length === 0) {
    list.innerHTML = '<div class="notification-empty">No notifications</div>';
    return;
  }

  notifications.forEach((notification) => {
    const item = createNotificationItem(notification, onMarkRead, onDelete);
    list.appendChild(item);
  });
};

/**
 * Update notification badge
 */
export const updateNotificationBadge = (count) => {
  const badge = document.getElementById('notification-badge');
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
};

/**
 * Add new notification to list
 */
export const addNotificationItem = (notification, onMarkRead, onDelete) => {
  const list = document.getElementById('notification-list');
  if (!list) return;

  // Remove empty state if present
  const emptyState = list.querySelector('.notification-empty');
  if (emptyState) {
    emptyState.remove();
  }

  const item = createNotificationItem(notification, onMarkRead, onDelete);
  list.insertBefore(item, list.firstChild);

  // Keep only last 50 notifications in UI
  const items = list.querySelectorAll('.notification-item');
  for (let i = 50; i < items.length; i++) {
    items[i].remove();
  }
};

/**
 * Remove notification from list
 */
export const removeNotificationItem = (notificationId) => {
  const item = document.querySelector(`[data-notification-id="${notificationId}"]`);
  if (item) {
    item.remove();
  }

  const list = document.getElementById('notification-list');
  if (list && list.children.length === 0) {
    list.innerHTML = '<div class="notification-empty">No notifications</div>';
  }
};

/**
 * Mark notification as read in UI
 */
export const markNotificationAsRead = (notificationId) => {
  const item = document.querySelector(`[data-notification-id="${notificationId}"]`);
  if (item) {
    item.classList.remove('unread');
    const markReadBtn = item.querySelector('.mark-read');
    if (markReadBtn) {
      markReadBtn.remove();
    }
  }
};

/**
 * Initialize notification center
 */
export const initializeNotificationCenter = () => {
  const toggle = document.getElementById('notification-toggle');
  const center = document.getElementById('notification-center');
  const closeBtn = document.getElementById('notification-close');

  if (toggle && center) {
    toggle.addEventListener('click', () => {
      center.classList.toggle('open');
    });
  }

  if (closeBtn && center) {
    closeBtn.addEventListener('click', () => {
      center.classList.remove('open');
    });
  }

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (center && !center.contains(e.target) && !toggle?.contains(e.target)) {
      center.classList.remove('open');
    }
  });
};
