import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import ChartCard from './ChartCard';
import ChartEmptyState from './ChartEmptyState';
import { CHART_COLORS, tooltipStyle } from './chartTheme';
import { hasAttackTypeData } from './chartUtils';

const BAR_COLORS = [
  CHART_COLORS.bot,
  CHART_COLORS.highRisk,
  CHART_COLORS.suspicious,
  '#6366f1',
  '#8b5cf6',
  '#0ea5e9',
];

export default function AttackTypeChart({ items }) {
  const data = (items || []).map((item) => ({
    name: item.type,
    count: item.count,
    percentage: item.percentage,
  }));

  const filtered = data.filter(
    (item) => item.name && item.name.toLowerCase() !== 'unknown'
  );
  const hasData = hasAttackTypeData(filtered);

  return (
    <ChartCard title="Attack type distribution" subtitle="Count and share by attack pattern">
      {!hasData ? (
        <ChartEmptyState />
      ) : (
        <ResponsiveContainer width="100%" height={Math.max(220, filtered.length * 36)}>
          <BarChart data={filtered} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} horizontal={false} />
            <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: CHART_COLORS.axis }} />
            <YAxis
              type="category"
              dataKey="name"
              width={120}
              tick={{ fontSize: 11, fill: CHART_COLORS.axis }}
            />
            <Tooltip
              contentStyle={tooltipStyle.contentStyle}
              formatter={(value, _name, props) => [
                `${value} (${props.payload.percentage}%)`,
                'Sessions',
              ]}
            />
            <Bar dataKey="count" name="Sessions" radius={[0, 4, 4, 0]} barSize={18}>
              {filtered.map((_, index) => (
                <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}
