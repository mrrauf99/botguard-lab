import { memo } from 'react';

const variants = {
  primary:
    'bg-gradient-to-r from-coral to-teal text-white shadow-md hover:opacity-95 active:scale-[0.98]',
  outline:
    'border-2 border-teal text-teal bg-transparent hover:bg-teal/10 active:scale-[0.98]',
  ghost: 'text-gray-600 hover:bg-gray-100 active:scale-[0.98]',
  danger: 'bg-red-500 text-white hover:bg-red-600 active:scale-[0.98]',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm min-h-[36px]',
  md: 'px-4 py-2 text-sm min-h-[44px]',
  lg: 'px-6 py-3 text-base min-h-[48px]',
};

function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  disabled = false,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default memo(Button);
