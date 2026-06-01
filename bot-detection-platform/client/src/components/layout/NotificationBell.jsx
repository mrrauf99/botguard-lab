import { memo, useCallback, useEffect, useRef, useState } from 'react';
import Button from '../ui/Button';
import NotificationList from '../notifications/NotificationList';
import { useNotificationContext } from '../../context/NotificationContext';
import { useAuth } from '../../hooks/useAuth';
import { unlockNotificationAudio } from '../../utils/notificationSound';

function NotificationBell() {
  const { isAuthenticated } = useAuth();
  const {
    notifications,
    loading,
    error,
    actionLoadingId,
    hasMore,
    markAsRead,
    removeNotification,
    markAllRead,
    deleteAll,
    loadMore,
    loadNotifications,
    badgeLabel,
  } = useNotificationContext();

  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const toggleRef = useRef(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return undefined;

    const handleOutside = (e) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        toggleRef.current &&
        !toggleRef.current.contains(e.target)
      ) {
        close();
      }
    };

    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open, close]);

  useEffect(() => {
    if (open && isAuthenticated) {
      loadNotifications(true);
    }
  }, [open, isAuthenticated, loadNotifications]);

  if (!isAuthenticated) return null;

  return (
    <div className="relative">
      <button
        ref={toggleRef}
        type="button"
        className={`relative inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-gray-200 bg-white text-lg transition hover:border-teal ${
          badgeLabel ? 'ring-2 ring-teal/20' : ''
        }`}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={`Notifications${badgeLabel ? `, ${badgeLabel} unread` : ''}`}
        onClick={() => {
          unlockNotificationAudio();
          setOpen((v) => !v);
        }}
      >
        🔔
        {badgeLabel && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-coral px-1 text-[10px] font-bold text-white">
            {badgeLabel}
          </span>
        )}
      </button>

      {open && (
        <div
          ref={panelRef}
          className="notification-panel-enter absolute right-0 z-[60] mt-2 flex max-h-[min(85vh,560px)] w-[calc(100vw-20px)] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl sm:w-[90vw] md:right-0 md:w-[min(500px,90vw)] lg:w-[min(480px,42vw)]"
          role="region"
          aria-label="Notification panel"
        >
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <h3 className="text-base font-semibold text-gray-900">Notifications</h3>
            <button
              type="button"
              className="min-h-[36px] min-w-[36px] rounded-lg text-gray-500 hover:bg-gray-100"
              aria-label="Close notifications"
              onClick={close}
            >
              ×
            </button>
          </div>

          <div className="border-b border-gray-100 px-3 py-2">
            <div className="flex flex-wrap gap-2">
              <Button variant="ghost" size="sm" onClick={markAllRead} disabled={!badgeLabel}>
                Mark all read
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={deleteAll}
                disabled={!notifications.length}
              >
                Delete all
              </Button>
            </div>
            <p className="mt-1.5 text-xs text-gray-500">
              ✓ marks one as read · ✕ removes it from your list (use after mark all read)
            </p>
          </div>

          <NotificationList
            notifications={notifications}
            loading={loading}
            error={error}
            actionLoadingId={actionLoadingId}
            onMarkRead={markAsRead}
            onDelete={removeNotification}
            onLoadMore={loadMore}
            hasMore={hasMore}
          />
        </div>
      )}
    </div>
  );
}

export default memo(NotificationBell);
