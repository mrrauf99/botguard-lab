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

export const hasHeatmapData = (buckets) => buckets?.some((b) => b.count > 0);

export const hasTopReasonsData = (reasons) => reasons?.length > 0;
