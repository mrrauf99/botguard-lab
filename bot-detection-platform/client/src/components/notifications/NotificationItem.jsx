import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getNotificationSessionId,
  getSecurityNotificationDetails,
  isSecurityNotification,
} from '../../services/notificationService';

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
  const isSecurity = isSecurityNotification(notification);
  const details = isSecurity ? getSecurityNotificationDetails(notification) : null;

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

  const timeLabel = getTimeAgo(notification.createdAt);
  const sessionShort = sessionId ? `${String(sessionId).slice(0, 8)}…` : null;

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
        <h4 className="text-sm font-semibold text-gray-900">{notification.title}</h4>

        {isSecurity && details ? (
          <div className="mt-1.5 space-y-0.5 text-xs text-gray-600">
            {sessionShort && <p>Session: {sessionShort}</p>}
            {details.riskScore != null && <p>Risk Score: {details.riskScore}/100</p>}
            {details.attackType && <p>Attack Type: {details.attackType}</p>}
            <p className="text-gray-400">{timeLabel}</p>
            {sessionId && <p className="pt-1 font-medium text-teal">Tap to replay →</p>}
          </div>
        ) : (
          <div className="mt-1.5 text-xs text-gray-600">
            <p className="line-clamp-2">{notification.message}</p>
            <p className="mt-1 text-gray-400">{timeLabel}</p>
            {sessionId && <p className="pt-1 font-medium text-teal">Tap to replay →</p>}
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-start gap-1">
        {!notification.read ? (
          <button
            type="button"
            className="min-h-[36px] min-w-[36px] cursor-pointer rounded-md bg-teal/10 px-2 text-xs font-medium text-teal hover:bg-teal/20 disabled:opacity-50"
            onClick={handleMarkRead}
            disabled={isActionLoading}
            aria-label="Mark as read"
            title="Mark as read"
          >
            ✓
          </button>
        ) : null}
        <button
          type="button"
          className="min-h-[36px] min-w-[36px] cursor-pointer rounded-md bg-red-50 px-2 text-xs font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
          onClick={handleDelete}
          disabled={isActionLoading}
          aria-label="Delete notification"
          title="Delete notification"
        >
          ✕
        </button>
      </div>
    </article>
  );
}

export default memo(NotificationItem);
