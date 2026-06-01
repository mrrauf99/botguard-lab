import { getApiUrl, getAuthHeaders } from './api.js';

const drawReplay = (canvas, events) => {
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  ctx.fillStyle = '#f9fafb';
  ctx.fillRect(0, 0, width, height);

  const mouseEvents = events.filter((e) => e.eventType === 'mousemove' && e.x != null);
  const clickEvents = events.filter((e) => e.eventType === 'click' && e.x != null);
  const scrollEvents = events.filter((e) => e.eventType === 'scroll');

  if (mouseEvents.length > 1) {
    ctx.strokeStyle = '#20c997';
    ctx.lineWidth = 2;
    ctx.beginPath();
    mouseEvents.forEach((e, i) => {
      const x = Math.min(e.x, width - 5);
      const y = Math.min(e.y, height - 5);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }

  clickEvents.forEach((e) => {
    const x = Math.min(e.x, width - 5);
    const y = Math.min(e.y, height - 5);
    ctx.fillStyle = '#ff6b6b';
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = '#6b7280';
  ctx.font = '14px sans-serif';
  ctx.fillText(
    `Mouse: ${mouseEvents.length} · Clicks: ${clickEvents.length} · Scrolls: ${scrollEvents.length}`,
    16,
    24
  );
};

const renderTimeline = (events) => {
  const list = document.getElementById('replay-timeline');
  if (!list) return;

  const navEvents = events.filter((e) =>
    ['navigation', 'click', 'form_submit'].includes(e.eventType)
  );

  if (navEvents.length === 0) {
    list.innerHTML = '<li style="color: var(--gray-500);">No navigation events recorded</li>';
    return;
  }

  list.innerHTML = navEvents
    .map((e) => {
      const time = new Date(e.timestamp).toLocaleTimeString();
      const label =
        e.eventType === 'click'
          ? `Click on ${e.targetElement || 'element'}`
          : e.eventType.replace('_', ' ');
      return `<li style="padding: 0.5rem 0; border-bottom: 1px solid var(--gray-100);">
        <strong>${time}</strong> — ${label}
      </li>`;
    })
    .join('');
};

export const initSessionReplay = async (sessionId) => {
  const statusEl = document.getElementById('replay-status');
  const canvas = document.getElementById('replay-canvas');

  if (!sessionId || !canvas) {
    if (statusEl) statusEl.textContent = 'Invalid session ID';
    return;
  }

  try {
    const response = await fetch(`${getApiUrl()}/dashboard/sessions/${sessionId}`, {
      headers: getAuthHeaders(),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to load session');
    }

    const events = data.events || [];
    drawReplay(canvas, events);
    renderTimeline(events);

    if (statusEl) {
      const cls = data.session?.classification || 'Pending';
      const score = data.session?.riskScore ?? 0;
      statusEl.textContent = `Classification: ${cls} · Risk score: ${score}/100 · ${events.length} events`;
    }
  } catch (error) {
    if (statusEl) statusEl.textContent = error.message;
  }
};

export default initSessionReplay;
