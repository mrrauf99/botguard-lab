import Card from '../ui/Card';

export default function ChartCard({ title, subtitle, actions, children, className = '' }) {
  return (
    <Card className={`flex h-full flex-col ${className}`}>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 sm:text-base">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>}
        </div>
        {actions && <div className="flex shrink-0 gap-1">{actions}</div>}
      </div>
      <div className="min-h-[220px] flex-1">{children}</div>
    </Card>
  );
}
