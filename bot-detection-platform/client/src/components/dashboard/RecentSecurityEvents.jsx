import { Link } from 'react-router-dom';
import ChartCard from './ChartCard';
import ChartEmptyState from './ChartEmptyState';

const SEVERITY_STYLES = {
  critical: 'bg-red-100 text-red-800 border-red-200',
  warning: 'bg-amber-100 text-amber-900 border-amber-200',
  info: 'bg-sky-100 text-sky-800 border-sky-200',
};

function formatEventTime(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function shortSessionId(id) {
  if (!id) return '—';
  const s = String(id);
  return `${s.slice(0, 8)}…`;
}

export default function RecentSecurityEvents({ events }) {
  const list = events || [];
  const hasData = list.length > 0;

  return (
    <ChartCard
      title="Recent security events"
      subtitle="Live feed · latest 20 incidents"
    >
      {!hasData ? (
        <ChartEmptyState message="No security events recorded yet" />
      ) : (
        <ul className="max-h-[320px] space-y-2 overflow-y-auto pr-1">
          {list.map((event) => {
            const severityClass =
              SEVERITY_STYLES[event.severity] || SEVERITY_STYLES.info;
            return (
              <li
                key={event.id}
                className="rounded-lg border border-gray-100 bg-gray-50/80 px-3 py-2.5 text-sm transition hover:border-gray-200 hover:bg-white"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <span className="shrink-0 font-mono text-xs text-gray-500">
                    {formatEventTime(event.time)}
                  </span>
                  <span
                    className={`rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${severityClass}`}
                  >
                    {event.severity}
                  </span>
                </div>
                <p className="mt-1 font-medium text-gray-900">{event.eventType}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                  <span>Session {shortSessionId(event.sessionId)}</span>
                  {event.riskScore != null && <span>Risk {event.riskScore}/100</span>}
                  {event.sessionId && (
                    <Link
                      to={`/replay/${event.sessionId}`}
                      className="text-teal underline hover:text-teal/80"
                    >
                      Replay
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </ChartCard>
  );
}
