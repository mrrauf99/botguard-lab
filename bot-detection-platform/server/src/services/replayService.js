/**
 * Builds a unified replay payload for all attack types.
 */
export const buildSessionReplay = (session, events = [], notification = null) => {
  const sessionId = session._id?.toString?.() || String(session._id);
  const notificationData = notification?.data || {};

  const attackType =
    formatAttackTypeLabel(session.attackType) ||
    notificationData.attackType ||
    formatAttackTypeLabel(notificationData.attackTypeSlug) ||
    inferAttackTypeFromReasons(session);

  const reasons = session.detectionReasons?.length
    ? session.detectionReasons
    : notificationData.reason
      ? [notificationData.reason]
      : [];

  const triggers = notificationData.triggers?.length
    ? notificationData.triggers
    : buildTriggersFromSession(session);

  const navigationEvents = events.filter((e) => e.eventType === 'navigation');
  const interactionEvents = events.filter((e) =>
    ['mousemove', 'click', 'scroll', 'keydown', 'form_submit', 'login_attempt'].includes(e.eventType)
  );

  const mouseActivity = events.filter((e) => e.eventType === 'mousemove');
  const scrollActivity = events.filter((e) => e.eventType === 'scroll');
  const loginAttempts = events.filter((e) => e.eventType === 'login_attempt');

  const timeline = buildReplayTimeline(session, events);

  const replay = {
    sessionId,
    attackType,
    classification: session.classification || 'PENDING',
    riskScore: session.riskScore ?? 0,
    reasons,
    triggers,
    events,
    navigationEvents,
    interactionEvents,
    mouseActivity,
    scrollActivity,
    loginAttempts,
    timeline,
    timestamps: {
      started: session.startTime,
      ended: session.endTime,
      durationMs: session.duration,
    },
    stats: {
      eventCount: events.length,
      mouseEvents: session.mouseEvents ?? mouseActivity.length,
      scrollEvents: session.scrollEvents ?? scrollActivity.length,
      clickEvents: session.clickEvents ?? 0,
      navigationEvents: session.navigationEvents ?? navigationEvents.length,
      loginAttempts: loginAttempts.length,
    },
    status: session.status,
  };

  console.warn(
    `[Replay] Built replay sessionId=${sessionId} attackType=${attackType || 'n/a'} events=${events.length} timeline=${timeline.length}`
  );

  return replay;
};

const ATTACK_TYPE_LABELS = {
  'login-attack': 'Login Attack',
  'spam-bot': 'Spam Bot',
  'scraper-bot': 'Scraper Bot',
};

function formatAttackTypeLabel(slug) {
  if (!slug) return null;
  return ATTACK_TYPE_LABELS[slug] || slug;
}

function inferAttackTypeFromReasons(session) {
  const joined = (session.detectionReasons || []).join(' ').toLowerCase();
  if (joined.includes('login')) return 'Login Attack';
  if (joined.includes('form') || joined.includes('spam') || joined.includes('submission')) {
    return 'Spam Bot';
  }
  if (joined.includes('navigation')) return 'Scraper Bot';
  return null;
}

function buildTriggersFromSession(session) {
  const triggers = [];
  if (session.classification === 'BOT') triggers.push('BOT Classification');
  if ((session.riskScore ?? 0) > 60) triggers.push('High Risk Threshold Exceeded');
  return triggers;
}

function buildReplayTimeline(session, events) {
  const sorted = [...events].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const timeline = sorted.map((event) => ({
    eventType: event.eventType,
    timestamp: event.timestamp,
    label: formatEventLabel(event),
    targetElement: event.targetElement,
    x: event.x,
    y: event.y,
  }));

  if (session.classification === 'BOT') {
    timeline.push({
      eventType: 'milestone',
      timestamp: session.endTime || session.updatedAt || new Date(),
      label: 'Session classified as BOT',
    });
  }

  if (session.status === 'blocked') {
    timeline.push({
      eventType: 'milestone',
      timestamp: session.endTime || session.updatedAt || new Date(),
      label: 'Session blocked',
    });
  }

  return timeline;
}

function formatEventLabel(event) {
  switch (event.eventType) {
    case 'login_attempt':
      return `Login attempt — ${event.targetElement || 'credentials'}`;
    case 'form_submit':
      return `Form submit — ${event.targetElement || 'form'}`;
    case 'navigation':
      return `Navigate — ${event.targetElement || 'page'}`;
    case 'click':
      return `Click — ${event.targetElement || 'element'}`;
    case 'mousemove':
      return 'Mouse movement';
    case 'scroll':
      return 'Scroll activity';
    case 'keydown':
      return 'Keystroke';
    default:
      return event.eventType?.replace(/_/g, ' ') || 'Event';
  }
}

export default { buildSessionReplay };
