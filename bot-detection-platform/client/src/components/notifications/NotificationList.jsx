import { memo } from 'react';
import EmptyState from '../ui/EmptyState';
import Loader from '../ui/Loader';
import NotificationItem from './NotificationItem';

function NotificationList({
  notifications,
  loading,
  error,
  actionLoadingId,
  onMarkRead,
  onDelete,
  onLoadMore,
  hasMore,
}) {
  if (loading && notifications.length === 0) {
    return <Loader label="Loading notifications…" size="sm" />;
  }

  if (error && notifications.length === 0) {
    return (
      <EmptyState
        icon="⚠️"
        title="Could not load notifications"
        description={error}
      />
    );
  }

  if (!notifications.length) {
    return (
      <EmptyState
        icon="🔔"
        title="No notifications yet"
        description="You'll see bot alerts and session updates here."
      />
    );
  }

  return (
    <div>
      {error && (
        <p className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-800" role="alert">
          {error}
        </p>
      )}
      <ul className="max-h-[min(60vh,420px)] overflow-y-auto overscroll-contain">
        {notifications.map((notification) => (
          <li key={notification._id}>
            <NotificationItem
              notification={notification}
              onMarkRead={onMarkRead}
              onDelete={onDelete}
              actionLoadingId={actionLoadingId}
            />
          </li>
        ))}
      </ul>
      {hasMore && (
        <div className="border-t border-gray-100 p-2">
          <button
            type="button"
            className="w-full rounded-lg py-2 text-sm font-medium text-teal hover:bg-teal/5 disabled:opacity-50"
            onClick={onLoadMore}
            disabled={loading}
          >
            {loading ? 'Loading…' : 'Load more'}
          </button>
        </div>
      )}
    </div>
  );
}

export default memo(NotificationList);
