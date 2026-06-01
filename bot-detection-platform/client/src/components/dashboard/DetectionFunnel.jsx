import ChartCard from './ChartCard';
import ChartEmptyState from './ChartEmptyState';
import { CHART_COLORS } from './chartTheme';

const STAGE_COLORS = {
  total: '#374151',
  suspicious: CHART_COLORS.suspicious,
  bot: CHART_COLORS.bot,
  blocked: CHART_COLORS.blocked,
};

export default function DetectionFunnel({ stages }) {
  const list = stages || [];
  const hasData = list.some((s) => s.count > 0);

  return (
    <ChartCard title="Detection funnel" subtitle="Session progression through threat stages">
      {!hasData ? (
        <ChartEmptyState />
      ) : (
        <div className="space-y-3">
          {list.map((stage, index) => (
            <div key={stage.key}>
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="font-medium text-gray-800">{stage.label}</span>
                <span className="font-semibold text-gray-900">{stage.count}</span>
              </div>
              <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.max(stage.percentOfTotal, 4)}%`,
                    backgroundColor: STAGE_COLORS[stage.key] || STAGE_COLORS.total,
                  }}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {stage.percentOfTotal}% of all sessions
                {index > 0 && stage.conversionFromPrevious != null && (
                  <span> · {stage.conversionFromPrevious}% from previous stage</span>
                )}
              </p>
              {index < list.length - 1 && (
                <p className="mt-2 text-center text-gray-300" aria-hidden="true">
                  ↓
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </ChartCard>
  );
}
