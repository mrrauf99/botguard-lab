import Session from '../models/Session.js';
import Notification from '../models/Notification.js';
import {
  formatAttackLabel,
  inferAttackTypeSlug,
} from '../utils/attackTypeResolver.js';

const GRANULARITY_FORMAT = {
  hour: '%Y-%m-%d %H:00',
  day: '%Y-%m-%d',
  week: '%G-W%V',
};

const RISK_BUCKETS = [
  { id: '0-20', min: 0, max: 20, label: '0–20' },
  { id: '21-40', min: 21, max: 40, label: '21–40' },
  { id: '41-60', min: 41, max: 60, label: '41–60' },
  { id: '61-80', min: 61, max: 80, label: '61–80' },
  { id: '81-100', min: 81, max: 100, label: '81–100' },
];

function getStartDate(days) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (parseInt(days, 10) || 7) + 1);
  return start;
}

function pivotClassificationTrends(rows, granularity) {
  const byPeriod = new Map();

  rows.forEach((row) => {
    const period = row._id.period;
    const cls = (row._id.classification || '').toLowerCase();
    if (!byPeriod.has(period)) {
      byPeriod.set(period, { period, human: 0, suspicious: 0, bot: 0 });
    }
    const entry = byPeriod.get(period);
    if (cls === 'human') entry.human = row.count;
    else if (cls === 'suspicious') entry.suspicious = row.count;
    else if (cls === 'bot') entry.bot = row.count;
  });

  const series = Array.from(byPeriod.values()).sort((a, b) =>
    String(a.period).localeCompare(String(b.period))
  );

  return { series, granularity };
}

export async function fetchClassificationOverTime(days = 7, granularity = 'day') {
  const g = GRANULARITY_FORMAT[granularity] ? granularity : 'day';
  const format = GRANULARITY_FORMAT[g];
  const startDate = getStartDate(days);

  const rows = await Session.aggregate([
    {
      $match: {
        startTime: { $gte: startDate },
        classification: { $in: ['HUMAN', 'SUSPICIOUS', 'BOT'] },
      },
    },
    {
      $group: {
        _id: {
          period: { $dateToString: { format, date: '$startTime' } },
          classification: '$classification',
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.period': 1 } },
  ]);

  return pivotClassificationTrends(rows, g);
}

export async function fetchDetectionMetricsTrends(days = 14) {
  const startDate = getStartDate(days);

  const rows = await Session.aggregate([
    { $match: { startTime: { $gte: startDate } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$startTime' } },
        botDetections: {
          $sum: { $cond: [{ $eq: ['$classification', 'BOT'] }, 1, 0] },
        },
        highRiskDetections: {
          $sum: { $cond: [{ $gte: ['$riskScore', 60] }, 1, 0] },
        },
        blockedSessions: {
          $sum: { $cond: [{ $eq: ['$status', 'blocked'] }, 1, 0] },
        },
        avgRiskScore: { $avg: '$riskScore' },
        detections: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const series = rows.map((r) => ({
    date: r._id,
    botDetections: r.botDetections,
    highRiskDetections: r.highRiskDetections,
    blockedSessions: r.blockedSessions,
    avgRiskScore: Math.round((r.avgRiskScore || 0) * 10) / 10,
    detections: r.detections,
  }));

  return { series, days: parseInt(days, 10) || 14 };
}

export async function fetchRiskHeatmap() {
  const distribution = await Session.aggregate([
    {
      $group: {
        _id: {
          $switch: {
            branches: RISK_BUCKETS.map((b) => ({
              case: {
                $and: [{ $gte: ['$riskScore', b.min] }, { $lte: ['$riskScore', b.max] }],
              },
              then: b.id,
            })),
            default: 'unknown',
          },
        },
        count: { $sum: 1 },
      },
    },
  ]);

  const countById = Object.fromEntries(distribution.map((d) => [d._id, d.count]));
  const total = RISK_BUCKETS.reduce((sum, b) => sum + (countById[b.id] || 0), 0);

  const buckets = RISK_BUCKETS.map((b, index) => {
    const count = countById[b.id] || 0;
    const percentage = total > 0 ? Math.round((count / total) * 1000) / 10 : 0;
    return {
      id: b.id,
      label: b.label,
      count,
      percentage,
      intensity: total > 0 ? count / total : 0,
      bandIndex: index,
    };
  });

  return { buckets, total };
}

export async function fetchAttackTypeDistribution() {
  const sessions = await Session.find({
    $or: [
      { classification: { $in: ['SUSPICIOUS', 'BOT'] } },
      { status: 'blocked' },
    ],
  })
    .select('attackType classification detectionReasons flags')
    .lean();

  const counts = new Map();

  sessions.forEach((session) => {
    const slug =
      inferAttackTypeSlug({
        attackType: session.attackType,
        classification: session.classification,
        detectionReasons: session.detectionReasons,
        flags: session.flags,
      }) || null;

    if (!slug) return;
    counts.set(slug, (counts.get(slug) || 0) + 1);
  });

  const rows = [...counts.entries()]
    .map(([typeKey, count]) => ({ typeKey, count }))
    .sort((a, b) => b.count - a.count);

  const total = rows.reduce((s, r) => s + r.count, 0);
  const items = rows.map((r) => ({
    type: formatAttackLabel(r.typeKey),
    typeKey: r.typeKey,
    count: r.count,
    percentage: total > 0 ? Math.round((r.count / total) * 1000) / 10 : 0,
  }));

  return { items, total };
}

export async function fetchDetectionFunnel() {
  const [total, suspicious, bot, blocked] = await Promise.all([
    Session.countDocuments({}),
    Session.countDocuments({ classification: 'SUSPICIOUS' }),
    Session.countDocuments({ classification: 'BOT' }),
    Session.countDocuments({ status: 'blocked' }),
  ]);

  const stages = [
    { key: 'total', label: 'Total Sessions', count: total },
    { key: 'suspicious', label: 'Suspicious Sessions', count: suspicious },
    { key: 'bot', label: 'BOT Sessions', count: bot },
    { key: 'blocked', label: 'Blocked Sessions', count: blocked },
  ];

  const withMetrics = stages.map((stage, index) => {
    const percentOfTotal = total > 0 ? Math.round((stage.count / total) * 1000) / 10 : 0;
    const previous = index > 0 ? stages[index - 1] : null;
    const conversionFromPrevious =
      previous && previous.count > 0
        ? Math.round((stage.count / previous.count) * 1000) / 10
        : null;

    return {
      ...stage,
      percentOfTotal,
      conversionFromPrevious,
    };
  });

  return { stages: withMetrics, total };
}

function buildSecurityEventLabel(notification) {
  const data = notification.data || {};
  const attackLabel =
    data.attackType || (data.attackTypeSlug ? formatAttackLabel(data.attackTypeSlug) : null);
  const classification = data.classification;
  const isBlocked = classification === 'BOT' || notification.type === 'bot-detected';

  if (attackLabel && isBlocked) {
    return `${attackLabel} Blocked`;
  }
  if (attackLabel && notification.type === 'bot-detected') {
    return `${attackLabel} Detected`;
  }
  if (attackLabel) {
    return `${attackLabel} — High Risk`;
  }
  if (classification === 'BOT') {
    return 'Session Classified BOT';
  }
  if (notification.type === 'high-risk') {
    return 'High Risk Session';
  }
  return notification.title || 'Security Event';
}

export async function fetchRecentSecurityEvents(limit = 20) {
  const cap = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 50);

  const notifications = await Notification.find({
    type: { $in: ['bot-detected', 'high-risk', 'anomaly'] },
  })
    .sort({ createdAt: -1 })
    .limit(cap)
    .lean();

  const events = notifications.map((n) => ({
    id: String(n._id),
    time: n.createdAt,
    eventType: buildSecurityEventLabel(n),
    severity: n.severity || 'info',
    sessionId: n.data?.sessionId ? String(n.data.sessionId) : null,
    riskScore: n.data?.riskScore ?? null,
    classification: n.data?.classification || null,
  }));

  return { events, limit: cap };
}

export async function fetchRealtimeActivity(minutes = 10) {
  const windowMinutes = Math.min(Math.max(parseInt(minutes, 10) || 10, 5), 30);
  const since = new Date(Date.now() - windowMinutes * 60 * 1000);
  const minuteFormat = '%Y-%m-%d %H:%M';

  const [sessionBuckets, eventBuckets, activeNow] = await Promise.all([
    Session.aggregate([
      { $match: { startTime: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: minuteFormat, date: '$startTime' } },
          activeSessions: { $sum: 1 },
          botDetections: {
            $sum: { $cond: [{ $eq: ['$classification', 'BOT'] }, 1, 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Event.aggregate([
      { $match: { timestamp: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: minuteFormat, date: '$timestamp' } },
          requests: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Session.countDocuments({ status: 'active' }),
  ]);

  const formatMinuteKey = (d) => {
    const y = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const h = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${y}-${mo}-${day} ${h}:${min}`;
  };

  const byMinute = new Map();
  const fillMinutes = () => {
    const points = [];
    const cursor = new Date(since);
    cursor.setSeconds(0, 0);
    const end = new Date();
    end.setSeconds(0, 0);
    while (cursor <= end) {
      const key = formatMinuteKey(cursor);
      const label = `${String(cursor.getHours()).padStart(2, '0')}:${String(cursor.getMinutes()).padStart(2, '0')}`;
      points.push({
        minute: key,
        label,
        activeSessions: 0,
        requestsPerMinute: 0,
        botDetections: 0,
      });
      cursor.setMinutes(cursor.getMinutes() + 1);
    }
    return points;
  };

  const points = fillMinutes();
  points.forEach((p) => byMinute.set(p.minute, p));

  sessionBuckets.forEach((b) => {
    const slot = byMinute.get(b._id);
    if (slot) {
      slot.activeSessions = b.activeSessions;
      slot.botDetections = b.botDetections;
    }
  });

  eventBuckets.forEach((b) => {
    const slot = byMinute.get(b._id);
    if (slot) {
      slot.requestsPerMinute = b.requests;
    }
  });

  const series = points.slice(-windowMinutes);

  return {
    series,
    activeNow,
    minutes: windowMinutes,
  };
}

export async function fetchSessionOutcomes() {
  const [human, suspicious, bot, blocked] = await Promise.all([
    Session.countDocuments({ classification: 'HUMAN', status: { $ne: 'blocked' } }),
    Session.countDocuments({ classification: 'SUSPICIOUS', status: { $ne: 'blocked' } }),
    Session.countDocuments({ classification: 'BOT', status: { $ne: 'blocked' } }),
    Session.countDocuments({ status: 'blocked' }),
  ]);

  const segments = [
    { key: 'human', label: 'Human', value: human },
    { key: 'suspicious', label: 'Suspicious', value: suspicious },
    { key: 'bot', label: 'BOT', value: bot },
    { key: 'blocked', label: 'Blocked', value: blocked },
  ];

  const total = segments.reduce((s, x) => s + x.value, 0);
  return {
    segments: segments.map((s) => ({
      ...s,
      percentage: total > 0 ? Math.round((s.value / total) * 1000) / 10 : 0,
    })),
    total,
  };
}

export async function fetchTopReasons(limit = 8) {
  const reasons = await Session.aggregate([
    { $unwind: '$detectionReasons' },
    { $match: { detectionReasons: { $nin: [null, ''] } } },
    { $group: { _id: '$detectionReasons', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: parseInt(limit, 10) || 8 },
  ]);

  const maxCount = reasons[0]?.count || 1;
  return {
    reasons: reasons.map((r) => ({
      reason: r._id,
      count: r.count,
      barWidth: Math.round((r.count / maxCount) * 100),
    })),
  };
}
