export const sumSeries = (series, keys) =>
  (series || []).reduce((total, row) => {
    const rowSum = keys.reduce((s, k) => s + (Number(row[k]) || 0), 0);
    return total + rowSum;
  }, 0);

export const hasClassificationTimeData = (series) => {
  if (!series?.length) return false;
  if (series.length < 2) {
    return sumSeries(series, ['human', 'suspicious', 'bot']) >= 3;
  }
  return sumSeries(series, ['human', 'suspicious', 'bot']) > 0;
};

export const hasDetectionMetricsData = (series) => {
  if (!series?.length) return false;
  if (series.length < 2) {
    return series.some(
      (d) =>
        (d.botDetections || 0) + (d.highRiskDetections || 0) + (d.blockedSessions || 0) >= 2
    );
  }
  return series.some(
    (d) => (d.botDetections || 0) + (d.detections || 0) + (d.blockedSessions || 0) > 0
  );
};

export const hasHeatmapData = (buckets) => buckets?.some((b) => b.count > 0);

export const hasAttackTypeData = (items) => items?.some((i) => i.count > 0);

export const hasRealtimeData = (series) => {
  if (!series?.length) return false;
  return series.some(
    (p) => (p.activeSessions || 0) + (p.requestsPerMinute || 0) + (p.botDetections || 0) > 0
  );
};

export const hasOutcomeData = (segments) => segments?.some((s) => s.value > 0);

export const hasTopReasonsData = (reasons) => reasons?.length > 0;
