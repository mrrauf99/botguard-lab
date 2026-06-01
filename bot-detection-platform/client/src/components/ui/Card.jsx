import { memo } from 'react';

function Card({ children, className = '', padding = true, ...props }) {
  return (
    <div
      className={`rounded-xl border border-gray-100 bg-white shadow-sm ${padding ? 'p-4 sm:p-6' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default memo(Card);
