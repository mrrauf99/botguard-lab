import { io } from 'https://cdn.socket.io/4.5.4/socket.io.esm.min.js';
import { getStoredToken } from './auth.js';

class NotificationManager {
  constructor(apiUrl = 'http://localhost:5000') {
    this.apiUrl = apiUrl;
    this.socket = null;
    this.isConnected = false;
    this.notifications = [];
    this.unreadCount = 0;
    this.callbacks = {
      onNotification: null,
      onUnreadChange: null,
      onConnected: null,
      onDisconnected: null,
    };
  }

  /**
   * Register callback for notifications
   */
  on(event, callback) {
    const key = `on${event.charAt(0).toUpperCase()}${event.slice(1)}`;
    if (Object.prototype.hasOwnProperty.call(this.callbacks, key)) {
      this.callbacks[key] = callback;
    }
  }

  /**
   * Connect to Socket.io server
   */
  connect() {
    try {
      this.socket = io(`${this.apiUrl}/dashboard`, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });

      this.socket.on('connect', () => {
        console.warn('[NotificationManager] Connected to Socket.io');
        this.isConnected = true;
        this.socket.emit('subscribe-detections');

        if (this.callbacks.onConnected) {
          this.callbacks.onConnected();
        }
      });

      this.socket.on('disconnect', () => {
        console.warn('[NotificationManager] Disconnected from Socket.io');
        this.isConnected = false;

        if (this.callbacks.onDisconnected) {
          this.callbacks.onDisconnected();
        }
      });

      // Listen for new notifications
      this.socket.on('new-notification', (notification) => {
        console.warn('[NotificationManager] New notification received:', notification.type);
        this.handleNewNotification(notification);
      });

      // Listen for user-specific notifications
      this.socket.on('user-notification', (notification) => {
        console.warn('[NotificationManager] User notification received:', notification.type);
        this.handleNewNotification(notification);
      });

      // Listen for critical alerts
      this.socket.on('critical-alert', (notification) => {
        console.warn('[NotificationManager] Critical alert received:', notification.type);
        this.handleCriticalAlert(notification);
      });

      this.socket.on('error', (error) => {
        console.warn(`[NotificationManager] Socket.io error: ${error}`);
      });
    } catch (error) {
      console.warn(`[NotificationManager] Connection failed: ${error.message}`);
    }
  }

  /**
   * Disconnect from Socket.io
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.isConnected = false;
    }
  }

  /**
   * Handle new notification
   */
  handleNewNotification(notification) {
    this.notifications.unshift(notification);

    // Keep only last 100 notifications in memory
    if (this.notifications.length > 100) {
      this.notifications.pop();
    }

    if (this.callbacks.onNotification) {
      this.callbacks.onNotification(notification);
    }
  }

  /**
   * Handle critical alert with visual/audio notification
   */
  handleCriticalAlert(notification) {
    this.handleNewNotification(notification);

    // Play sound if available
    this.playAlertSound();

    // Show browser notification if permitted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/botguard-icon.png',
        tag: `critical-${Date.now()}`,
        requireInteraction: true,
      });
    }
  }

  /**
   * Play alert sound
   */
  playAlertSound() {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.warn(`[NotificationManager] Failed to play alert sound: ${error.message}`);
    }
  }

  /**
   * Request browser notification permission
   */
  requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }

  /**
   * Fetch user notifications from server
   */
  async fetchNotifications(limit = 20, skip = 0) {
    try {
      const token = getStoredToken();
      if (!token) {
        console.warn('[NotificationManager] No auth token available');
        return null;
      }

      const response = await fetch(`${this.apiUrl}/notifications?limit=${limit}&skip=${skip}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch notifications');

      const data = await response.json();
      this.notifications = data.notifications;
      return data;
    } catch (error) {
      console.warn(`[NotificationManager] Failed to fetch notifications: ${error.message}`);
      return null;
    }
  }

  /**
   * Fetch unread count
   */
  async fetchUnreadCount() {
    try {
      const token = getStoredToken();
      if (!token) return null;

      const response = await fetch(`${this.apiUrl}/notifications/unread-count`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch unread count');

      const data = await response.json();
      this.unreadCount = data.unreadCount;

      if (this.callbacks.onUnreadChange) {
        this.callbacks.onUnreadChange(this.unreadCount);
      }

      return this.unreadCount;
    } catch (error) {
      console.warn(`[NotificationManager] Failed to fetch unread count: ${error.message}`);
      return null;
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId) {
    try {
      const token = getStoredToken();
      if (!token) return null;

      const response = await fetch(`${this.apiUrl}/notifications/mark-read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ notificationId }),
      });

      if (!response.ok) throw new Error('Failed to mark notification as read');

      await this.fetchUnreadCount();
      return await response.json();
    } catch (error) {
      console.warn(`[NotificationManager] Failed to mark as read: ${error.message}`);
      return null;
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead() {
    try {
      const token = getStoredToken();
      if (!token) return null;

      const response = await fetch(`${this.apiUrl}/notifications/mark-all-read`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to mark all as read');

      this.unreadCount = 0;
      if (this.callbacks.onUnreadChange) {
        this.callbacks.onUnreadChange(0);
      }

      return await response.json();
    } catch (error) {
      console.warn(`[NotificationManager] Failed to mark all as read: ${error.message}`);
      return null;
    }
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId) {
    try {
      const token = getStoredToken();
      if (!token) return null;

      const response = await fetch(`${this.apiUrl}/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete notification');

      this.notifications = this.notifications.filter((n) => n._id !== notificationId);
      await this.fetchUnreadCount();
      return await response.json();
    } catch (error) {
      console.warn(`[NotificationManager] Failed to delete notification: ${error.message}`);
      return null;
    }
  }

  /**
   * Initialize notification center
   */
  async initialize() {
    try {
      console.warn('[NotificationManager] Initializing...');

      // Connect to Socket.io
      this.connect();

      // Request browser notification permission
      this.requestNotificationPermission();

      // Fetch initial data
      const token = getStoredToken();
      if (token) {
        await Promise.all([this.fetchNotifications(20), this.fetchUnreadCount()]);
      }

      console.warn('[NotificationManager] Initialized');
      return true;
    } catch (error) {
      console.warn(`[NotificationManager] Initialization failed: ${error.message}`);
      return false;
    }
  }

  /**
   * Get notification by type
   */
  getNotificationsByType(type) {
    return this.notifications.filter((n) => n.type === type);
  }

  /**
   * Get unread notifications
   */
  getUnreadNotifications() {
    return this.notifications.filter((n) => !n.read);
  }

  /**
   * Clear all notifications
   */
  clearAll() {
    this.notifications = [];
    this.unreadCount = 0;
  }
}

export default NotificationManager;
