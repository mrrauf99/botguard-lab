import { memo } from 'react';

function PageHeader({ title, subtitle, children }) {
  return (
    <header className="mb-8 border-b border-gray-200 pb-6">
      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">{title}</h1>
      {subtitle && <p className="mt-2 text-sm text-gray-500 sm:text-base">{subtitle}</p>}
      {children}
    </header>
  );
}

export default memo(PageHeader);
