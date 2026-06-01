import ChartCard from './ChartCard';
import ChartEmptyState from './ChartEmptyState';
import { CHART_COLORS } from './chartTheme';
import { hasHeatmapData } from './chartUtils';

function riskColor(intensity) {
  if (intensity >= 0.5) return CHART_COLORS.riskCritical;
  if (intensity >= 0.3) return CHART_COLORS.riskHigh;
  if (intensity >= 0.15) return CHART_COLORS.riskMid;
  return CHART_COLORS.riskLow;
}

export default function RiskHeatmapChart({ buckets, total }) {
  const hasData = hasHeatmapData(buckets);

  return (
    <ChartCard title="Risk score heatmap" subtitle="Session distribution by risk band">
      {!hasData ? (
        <ChartEmptyState />
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-gray-500">{total} classified sessions</p>
          <div className="grid gap-2 sm:grid-cols-5">
            {buckets.map((bucket) => (
              <div
                key={bucket.id}
                className="flex flex-col rounded-lg border border-gray-100 p-3 transition hover:shadow-sm"
                style={{
                  backgroundColor: `${riskColor(bucket.intensity)}22`,
                  borderColor: `${riskColor(bucket.intensity)}66`,
                }}
                title={`${bucket.count} sessions (${bucket.percentage}%)`}
              >
                <span className="text-xs font-semibold text-gray-700">{bucket.label}</span>
                <span className="mt-2 text-2xl font-bold text-gray-900">{bucket.count}</span>
                <span className="text-xs text-gray-600">{bucket.percentage}%</span>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/60">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.max(bucket.percentage, 4)}%`,
                      backgroundColor: riskColor(bucket.intensity),
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </ChartCard>
  );
}
