import { memo } from 'react';

function Loader({ label = 'Loading…', size = 'md' }) {
  const sizeClass = size === 'sm' ? 'h-5 w-5 border-2' : 'h-8 w-8 border-[3px]';

  return (
    <div className="flex flex-col items-center gap-3" role="status" aria-live="polite">
      <div
        className={`${sizeClass} animate-spin rounded-full border-teal border-t-transparent`}
        aria-hidden="true"
      />
      {label && <p className="text-sm text-gray-500">{label}</p>}
    </div>
  );
}

export default memo(Loader);
