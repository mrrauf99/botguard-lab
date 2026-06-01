import { memo, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import Card from '../components/ui/Card';
import Loader from '../components/ui/Loader';
import PageHeader from '../components/ui/PageHeader';
import { drawReplay, getTimelineEvents } from '../utils/replayCanvas';

function Replay() {
  const { sessionId } = useParams();
  const canvasRef = useRef(null);
  const [status, setStatus] = useState('Loading session data…');
  const [timeline, setTimeline] = useState([]);
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

        const loadedEvents = data.events || [];
        setEvents(loadedEvents);
        setTimeline(getTimelineEvents(loadedEvents));
        const cls = data.session?.classification || 'Pending';
        const score = data.session?.riskScore ?? 0;
        setStatus(`Classification: ${cls} · Risk score: ${score}/100 · ${loadedEvents.length} events`);
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
    if (loading || error || !events.length) return undefined;

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

  return (
    <section className="py-6 sm:py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Link to="/dashboard" className="text-sm font-medium text-teal hover:underline">
          ← Back to Dashboard
        </Link>
        <PageHeader
          title="Session Replay"
          subtitle={
            <span>
              Session: <code className="rounded bg-gray-100 px-1 text-xs">{sessionId}</code>
            </span>
          }
        />

        {loading && <Loader label="Loading replay…" />}
        {error && (
          <p className="text-sm text-coral" role="alert">
            {error}
          </p>
        )}
        {!loading && !error && (
          <>
            <p className="mb-4 text-sm text-gray-600">{status}</p>
            <Card padding={false} className="overflow-hidden">
              <canvas
                ref={canvasRef}
                className="block w-full max-w-full bg-gray-50"
                aria-label="Session replay visualization"
              />
            </Card>
            <Card className="mt-6">
              <h3 className="mb-4 font-semibold text-gray-900">Navigation Timeline</h3>
              {timeline.length === 0 ? (
                <p className="text-sm text-gray-500">No navigation events recorded</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {timeline.map((e, i) => {
                    const time = new Date(e.timestamp).toLocaleTimeString();
                    const label =
                      e.eventType === 'click'
                        ? `Click on ${e.targetElement || 'element'}`
                        : e.eventType.replace('_', ' ');
                    return (
                      <li key={`${e.timestamp}-${i}`} className="py-2 text-sm">
                        <strong className="text-gray-800">{time}</strong>
                        <span className="text-gray-600"> — {label}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Card>
          </>
        )}
      </div>
    </section>
  );
}

export default memo(Replay);
