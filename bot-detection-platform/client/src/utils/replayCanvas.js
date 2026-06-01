export const drawReplay = (canvas, events) => {
  const ctx = canvas.getContext('2d');
  const { width, height } = canvas;

  ctx.fillStyle = '#f9fafb';
  ctx.fillRect(0, 0, width, height);

  const mouseEvents = events.filter((e) => e.eventType === 'mousemove' && e.x != null);
  const clickEvents = events.filter((e) => e.eventType === 'click' && e.x != null);
  const scrollEvents = events.filter((e) => e.eventType === 'scroll');
  const loginAttempts = events.filter((e) => e.eventType === 'login_attempt');

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

  if (loginAttempts.length > 0) {
    ctx.fillStyle = '#374151';
    ctx.font = '13px sans-serif';
    ctx.fillText('Login attempts:', 16, mouseEvents.length > 0 ? 48 : 24);
    loginAttempts.slice(0, 8).forEach((e, i) => {
      ctx.fillStyle = '#6b7280';
      ctx.fillText(`• ${e.targetElement || `Attempt ${i + 1}`}`, 24, (mouseEvents.length > 0 ? 68 : 44) + i * 18);
    });
  }

  ctx.fillStyle = '#6b7280';
  ctx.font = '14px sans-serif';
  const summaryY = height - 16;
  ctx.fillText(
    `Mouse: ${mouseEvents.length} · Clicks: ${clickEvents.length} · Scrolls: ${scrollEvents.length} · Logins: ${loginAttempts.length}`,
    16,
    summaryY
  );
};

export const getTimelineEvents = (events) =>
  events.filter((e) =>
    ['navigation', 'click', 'form_submit', 'login_attempt', 'milestone'].includes(e.eventType)
  );

export const formatTimelineLabel = (event) => {
  if (event.label) return event.label;
  if (event.eventType === 'login_attempt') {
    return `Login attempt — ${event.targetElement || 'credentials'}`;
  }
  if (event.eventType === 'click') {
    return `Click on ${event.targetElement || 'element'}`;
  }
  if (event.eventType === 'form_submit') {
    return `Form submit — ${event.targetElement || 'form'}`;
  }
  if (event.eventType === 'navigation') {
    return `Navigate — ${event.targetElement || 'page'}`;
  }
  return event.eventType?.replace(/_/g, ' ') || 'Event';
};
