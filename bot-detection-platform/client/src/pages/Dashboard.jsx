import { memo } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Loader from '../components/ui/Loader';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import DashboardAnalytics from '../components/dashboard/DashboardAnalytics';
import { useDashboard } from '../hooks/useDashboard';

function StatWidget({ label, value, accent, sub }) {
  return (
    <Card className={`border-l-4 ${accent}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">{value}</p>
      {sub && <p className="mt-1 text-xs text-gray-500">{sub}</p>}
    </Card>
  );
}

function Dashboard() {
  const {
    stats,
    sessions,
    highRisk,
    classificationSeries,
    classificationGranularity,
    setClassificationGranularity,
    riskHeatmap,
    detectionFunnel,
    topReasons,
    securityEvents,
    loading,
    error,
  } = useDashboard();

  const classification = stats?.classification || {};
  const total = stats?.overview?.totalSessions || 0;
  const human = classification.human || 0;
  const bot = classification.bot || 0;
  const suspicious = classification.suspicious || 0;
  const active = stats?.overview?.activeSessions || 0;
  const avgRisk = stats?.overview?.averageRiskScore || '0';

  const pct = (v) => (total === 0 ? '0%' : `${((v / total) * 100).toFixed(1)}%`);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader label="Loading dashboard…" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <PageHeader
          title="Admin Dashboard"
          subtitle="Security analytics, detection trends, and live session monitoring"
        >
          {error && (
            <p className="mt-2 text-sm text-coral" role="alert">
              {error}.{' '}
              <Link to="/login" className="underline">
                Sign in as admin
              </Link>{' '}
              to load protected analytics.
            </p>
          )}
        </PageHeader>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatWidget label="Total Sessions" value={total} accent="border-l-gray-900" sub="Classified" />
          <StatWidget label="Human" value={human} accent="border-l-emerald" sub={pct(human)} />
          <StatWidget label="BOT" value={bot} accent="border-l-red-500" sub={pct(bot)} />
          <StatWidget label="Suspicious" value={suspicious} accent="border-l-orange-500" sub={pct(suspicious)} />
          <StatWidget
            label="Active / Avg risk"
            value={active}
            accent="border-l-teal"
            sub={`Avg risk ${avgRisk}`}
          />
        </div>

        <div className="mb-8">
          <DashboardAnalytics
            classificationSeries={classificationSeries}
            classificationGranularity={classificationGranularity}
            onGranularityChange={setClassificationGranularity}
            riskHeatmap={riskHeatmap}
            detectionFunnel={detectionFunnel}
            topReasons={topReasons}
            securityEvents={securityEvents}
          />
        </div>

        <Card className="mb-8 overflow-hidden !p-0">
          <div className="border-b border-gray-100 px-4 py-4 sm:px-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Sessions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-600">
                <tr>
                  <th className="px-4 py-3">Session ID</th>
                  <th className="px-4 py-3">Classification</th>
                  <th className="px-4 py-3">Risk</th>
                  <th className="hidden px-4 py-3 sm:table-cell">Duration</th>
                  <th className="hidden px-4 py-3 md:table-cell">Events</th>
                  <th className="hidden px-4 py-3 lg:table-cell">Started</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {!sessions.length ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      No sessions yet
                    </td>
                  </tr>
                ) : (
                  sessions.map((session) => {
                    const sessionId = session._id?.toString?.() || session._id;
                    const cls = (session.classification || 'PENDING').toLowerCase();
                    return (
                      <tr key={sessionId} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-xs">
                          {String(sessionId).slice(0, 8)}…
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={
                              cls === 'human' ? 'success' : cls === 'bot' ? 'info' : 'warning'
                            }
                          >
                            {session.classification || 'PENDING'}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">{session.riskScore ?? 0}/100</td>
                        <td className="hidden px-4 py-3 sm:table-cell">
                          {session.duration ? `${(session.duration / 1000).toFixed(1)}s` : 'N/A'}
                        </td>
                        <td className="hidden px-4 py-3 md:table-cell">{session.eventCount || 0}</td>
                        <td className="hidden px-4 py-3 lg:table-cell">
                          {new Date(session.startTime).toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <Link to={`/replay/${sessionId}`}>
                            <Button variant="outline" size="sm">
                              Replay
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">High Risk Sessions</h2>
          {!highRisk.length ? (
            <p className="text-sm text-gray-500">No high-risk sessions detected.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {highRisk.map((session) => {
                const sessionId = session._id?.toString?.() || session._id;
                return (
                  <div
                    key={sessionId}
                    className={`rounded-lg border-l-4 p-4 text-sm ${
                      session.riskScore > 80
                        ? 'border-red-600 bg-red-50 text-red-900'
                        : 'border-amber-500 bg-amber-50 text-amber-900'
                    }`}
                  >
                    <p className="font-semibold">Risk: {session.riskScore}/100</p>
                    <p className="mt-1 opacity-80">Session: {String(sessionId).slice(0, 8)}…</p>
                    <Link
                      to={`/replay/${sessionId}`}
                      className="mt-2 inline-block text-teal underline"
                    >
                      View replay
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default memo(Dashboard);
