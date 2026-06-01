import { memo, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Loader from '../components/ui/Loader';
import PageHeader from '../components/ui/PageHeader';
import { drawReplay, formatTimelineLabel } from '../utils/replayCanvas';

const ATTACK_TYPE_LABELS = {
  'login-attack': 'Login Attack',
  'spam-bot': 'Spam Bot',
  'scraper-bot': 'Scraper Bot',
};

function formatAttackType(value) {
  if (!value) return null;
  return ATTACK_TYPE_LABELS[value] || value;
}

function ReplaySection({ title, children }) {
  return (
    <Card className="mt-4">
      <h3 className="mb-3 text-base font-semibold text-gray-900 sm:text-lg">{title}</h3>
      {children}
    </Card>
  );
}

function Replay() {
  const { sessionId } = useParams();
  const canvasRef = useRef(null);
  const [replay, setReplay] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sessionId) {
      setError('Invalid session ID');
      setLoading(false);
      return undefined;
    }

    let cancelled = false;

    const load = async () => {
      try {
        const { data } = await api.get(`/dashboard/sessions/${sessionId}`);
        if (cancelled) return;

        const loadedEvents = data.replay?.events || data.events || [];
        setReplay(data.replay || null);
        setEvents(loadedEvents);
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.error || err.message || 'Failed to load session');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  useEffect(() => {
    if (loading || error) return undefined;

    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = Math.min(rect.width, 900);
        canvas.height = Math.min(500, Math.max(280, rect.width * 0.55));
      }
      drawReplay(canvas, events);
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [loading, error, events]);

  const timeline = replay?.timeline || [];
  const reasons = replay?.reasons || [];
  const triggers = replay?.triggers || [];
  const stats = replay?.stats || {};
  const attackType = formatAttackType(replay?.attackType) || replay?.attackType;
  const classification = replay?.classification;
  const riskScore = replay?.riskScore;

  return (
    <section className="py-6 sm:py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Link to="/dashboard" className="text-sm font-medium text-teal hover:underline">
          ← Back to Dashboard
        </Link>
        <PageHeader title="Session Replay" subtitle={`Session ${sessionId}`} />

        {loading && <Loader label="Loading replay…" />}
        {error && (
          <p className="text-sm text-coral" role="alert">
            {error}
          </p>
        )}

        {!loading && !error && replay && (
          <>
            <ReplaySection title="Session Overview">
              <dl className="grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-gray-500">Session ID</dt>
                  <dd className="font-mono text-xs text-gray-900 break-all">{sessionId}</dd>
                </div>
                {attackType && (
                  <div>
                    <dt className="text-gray-500">Attack Type</dt>
                    <dd className="text-gray-900">{attackType}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-gray-500">Classification</dt>
                  <dd>
                    <Badge
                      variant={
                        classification === 'HUMAN'
                          ? 'success'
                          : classification === 'BOT'
                            ? 'info'
                            : 'warning'
                      }
                    >
                      {classification || 'PENDING'}
                    </Badge>
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">Risk Score</dt>
                  <dd className="font-semibold text-gray-900">{riskScore ?? 0}/100</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Status</dt>
                  <dd className="text-gray-900">{replay.status || '—'}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Total Events</dt>
                  <dd className="text-gray-900">{stats.eventCount ?? events.length}</dd>
                </div>
              </dl>
            </ReplaySection>

            {reasons.length > 0 && (
              <ReplaySection title="Detection Reasons">
                <ul className="list-inside list-disc space-y-1 text-sm text-gray-700">
                  {reasons.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </ReplaySection>
            )}

            {triggers.length > 0 && (
              <ReplaySection title="Triggers">
                <ul className="list-inside list-disc space-y-1 text-sm text-gray-700">
                  {triggers.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </ReplaySection>
            )}

            <ReplaySection title="Activity Summary">
              <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-gray-500">Mouse</p>
                  <p className="font-semibold">{stats.mouseEvents ?? 0}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-gray-500">Scroll</p>
                  <p className="font-semibold">{stats.scrollEvents ?? 0}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-gray-500">Navigation</p>
                  <p className="font-semibold">{stats.navigationEvents ?? 0}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-gray-500">Login Attempts</p>
                  <p className="font-semibold">{stats.loginAttempts ?? 0}</p>
                </div>
              </div>
            </ReplaySection>

            <Card padding={false} className="mt-4 overflow-hidden">
              <div className="border-b border-gray-100 px-4 py-3">
                <h3 className="font-semibold text-gray-900">Interaction Replay</h3>
              </div>
              <canvas
                ref={canvasRef}
                className="block w-full max-w-full bg-gray-50"
                aria-label="Session replay visualization"
              />
            </Card>

            <ReplaySection title="Event Timeline">
              {timeline.length === 0 ? (
                <p className="text-sm text-gray-500">No events recorded for this session.</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {timeline.map((event, i) => {
                    const time = new Date(event.timestamp).toLocaleTimeString();
                    return (
                      <li key={`${event.timestamp}-${i}`} className="py-2 text-sm">
                        <strong className="text-gray-800">{time}</strong>
                        <span className="text-gray-600"> — {formatTimelineLabel(event)}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </ReplaySection>
          </>
        )}
      </div>
    </section>
  );
}

export default memo(Replay);
