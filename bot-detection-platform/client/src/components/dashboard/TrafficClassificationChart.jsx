import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import ChartCard from './ChartCard';
import ChartEmptyState from './ChartEmptyState';
import { CHART_COLORS, formatPeriodLabel, tooltipStyle } from './chartTheme';
import { hasClassificationTimeData } from './chartUtils';

const GRANULARITY_OPTIONS = [
  { id: 'hour', label: 'Hour' },
  { id: 'day', label: 'Day' },
  { id: 'week', label: 'Week' },
];

export default function TrafficClassificationChart({
  series,
  granularity,
  onGranularityChange,
}) {
  const data = (series || []).map((row) => ({
    ...row,
    label: formatPeriodLabel(row.period, granularity),
  }));

  const hasData = hasClassificationTimeData(data);

  return (
    <ChartCard
      title="Traffic classification over time"
      subtitle="Human, suspicious, and BOT session volume"
      actions={GRANULARITY_OPTIONS.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onGranularityChange?.(opt.id)}
          className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
            granularity === opt.id
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {opt.label}
        </button>
      ))}
    >
      {!hasData ? (
        <ChartEmptyState />
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: CHART_COLORS.axis }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: CHART_COLORS.axis }} />
            <Tooltip contentStyle={tooltipStyle.contentStyle} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Area
              type="monotone"
              dataKey="human"
              name="Human"
              stackId="1"
              stroke={CHART_COLORS.human}
              fill={CHART_COLORS.human}
              fillOpacity={0.55}
            />
            <Area
              type="monotone"
              dataKey="suspicious"
              name="Suspicious"
              stackId="1"
              stroke={CHART_COLORS.suspicious}
              fill={CHART_COLORS.suspicious}
              fillOpacity={0.55}
            />
            <Area
              type="monotone"
              dataKey="bot"
              name="BOT"
              stackId="1"
              stroke={CHART_COLORS.bot}
              fill={CHART_COLORS.bot}
              fillOpacity={0.55}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}
