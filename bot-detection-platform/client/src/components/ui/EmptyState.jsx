import { memo } from 'react';

function EmptyState({ icon = '🔔', title = 'Nothing here yet', description, action }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
      <span className="mb-3 text-3xl" aria-hidden="true">
        {icon}
      </span>
      <p className="text-sm font-semibold text-gray-800">{title}</p>
      {description && <p className="mt-1 max-w-xs text-sm text-gray-500">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export default memo(EmptyState);
