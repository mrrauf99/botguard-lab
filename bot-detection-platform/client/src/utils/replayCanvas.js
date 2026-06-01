export const drawReplay = (canvas, events) => {
  const ctx = canvas.getContext('2d');
  const { width, height } = canvas;

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

export const getTimelineEvents = (events) =>
  events.filter((e) => ['navigation', 'click', 'form_submit'].includes(e.eventType));
