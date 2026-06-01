export const CHART_COLORS = {
  human: '#22c55e',
  suspicious: '#f97316',
  bot: '#ef4444',
  blocked: '#991b1b',
  highRisk: '#ea580c',
  grid: '#e5e7eb',
  axis: '#6b7280',
  muted: '#9ca3af',
  teal: '#20c997',
  riskLow: '#86efac',
  riskMid: '#fbbf24',
  riskHigh: '#f87171',
  riskCritical: '#b91c1c',
};

export const tooltipStyle = {
  contentStyle: {
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    fontSize: '12px',
  },
};

export const formatPeriodLabel = (period, granularity = 'day') => {
  if (!period) return '';
  if (granularity === 'hour') {
    const parts = String(period).split(' ');
    return parts[1] || period;
  }
  if (granularity === 'week') return String(period).replace('-W', ' W');
  const d = new Date(`${period}T12:00:00`);
  if (Number.isNaN(d.getTime())) return period;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};
