import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotificationSessionId } from '../../services/notificationService';

const TYPE_EMOJI = {
  'bot-detected': '🤖',
  'session-ended': '⏹️',
  'high-risk': '⚠️',
  anomaly: '❓',
  system: 'ℹ️',
};

function getTimeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function NotificationItem({
  notification,
  onMarkRead,
  onDelete,
  actionLoadingId,
}) {
  const navigate = useNavigate();
  const sessionId = getNotificationSessionId(notification);
  const isActionLoading = actionLoadingId === notification._id;

  const handleCardClick = useCallback(() => {
    if (sessionId) {
      navigate(`/replay/${sessionId}`);
    }
  }, [navigate, sessionId]);

  const handleMarkRead = useCallback(
    (e) => {
      e.stopPropagation();
      onMarkRead(notification._id);
    },
    [notification._id, onMarkRead]
  );

  const handleDelete = useCallback(
    (e) => {
      e.stopPropagation();
      onDelete(notification._id);
    },
    [notification._id, onDelete]
  );

  const severityBorder = {
    info: 'border-l-gray-400',
    warning: 'border-l-amber-500',
    critical: 'border-l-red-500',
  };

  return (
    <article
      role="button"
      tabIndex={sessionId ? 0 : -1}
      onClick={sessionId ? handleCardClick : undefined}
      onKeyDown={(e) => {
        if (sessionId && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleCardClick();
        }
      }}
      className={`notification-panel-enter flex gap-3 border-b border-gray-100 border-l-4 px-3 py-3 transition hover:bg-gray-50 sm:px-4 ${
        severityBorder[notification.severity] || severityBorder.info
      } ${!notification.read ? 'bg-teal/5' : ''} ${sessionId ? 'cursor-pointer' : ''}`}
      aria-label={notification.title}
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start gap-2">
          <span aria-hidden="true">{TYPE_EMOJI[notification.type] || '📢'}</span>
          <h4 className="flex-1 text-sm font-semibold text-gray-900">{notification.title}</h4>
          <time className="shrink-0 text-xs text-gray-400" dateTime={notification.createdAt}>
            {getTimeAgo(notification.createdAt)}
          </time>
        </div>
        <p className="mt-1 text-sm text-gray-600 line-clamp-2">{notification.message}</p>
        {sessionId && (
          <p className="mt-1 text-xs text-teal">
            Session: {String(sessionId).slice(0, 8)}… — tap to replay
          </p>
        )}
      </div>
      <div className="flex shrink-0 flex-col gap-1">
        {!notification.read && (
          <button
            type="button"
            className="min-h-[36px] min-w-[36px] rounded-md bg-teal/10 px-2 text-xs font-medium text-teal hover:bg-teal/20 disabled:opacity-50"
            onClick={handleMarkRead}
            disabled={isActionLoading}
            aria-label="Mark as read"
          >
            ✓
          </button>
        )}
        <button
          type="button"
          className="min-h-[36px] min-w-[36px] rounded-md bg-red-50 px-2 text-xs font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
          onClick={handleDelete}
          disabled={isActionLoading}
          aria-label="Delete notification"
        >
          ✕
        </button>
      </div>
    </article>
  );
}

export default memo(NotificationItem);
