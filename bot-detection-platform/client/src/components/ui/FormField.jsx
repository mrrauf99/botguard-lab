import { memo } from 'react';

function FormField({ label, id, error, children, className = '' }) {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      {children}
      {error && (
        <p className="mt-1 text-sm text-coral" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full min-h-[44px] rounded-lg border border-gray-300 px-3 py-2 text-base text-gray-900 transition focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/30 sm:text-sm ${className}`}
      {...props}
    />
  );
}

export default memo(FormField);
