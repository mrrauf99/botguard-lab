import ChartCard from './ChartCard';
import ChartEmptyState from './ChartEmptyState';
import { CHART_COLORS } from './chartTheme';
import { hasTopReasonsData } from './chartUtils';

export default function TopReasonsList({ reasons }) {
  const hasData = hasTopReasonsData(reasons);

  return (
    <ChartCard title="Top detection reasons" subtitle="Most frequent triggers across sessions">
      {!hasData ? (
        <ChartEmptyState />
      ) : (
        <ul className="space-y-3">
          {reasons.map((item) => (
            <li key={item.reason}>
              <div className="mb-1 flex items-center justify-between gap-2 text-xs">
                <span className="truncate font-medium text-gray-800" title={item.reason}>
                  {item.reason}
                </span>
                <span className="shrink-0 font-semibold text-gray-900">{item.count}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${item.barWidth}%`,
                    backgroundColor: CHART_COLORS.bot,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </ChartCard>
  );
}
