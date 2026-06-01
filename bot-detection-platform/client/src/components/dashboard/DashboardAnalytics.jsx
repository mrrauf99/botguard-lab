import { memo } from 'react';
import DetectionFunnel from './DetectionFunnel';
import RecentSecurityEvents from './RecentSecurityEvents';
import RiskHeatmapChart from './RiskHeatmapChart';
import TopReasonsList from './TopReasonsList';
import TrafficClassificationChart from './TrafficClassificationChart';

function DashboardAnalytics({
  classificationSeries,
  classificationGranularity,
  onGranularityChange,
  riskHeatmap,
  detectionFunnel,
  topReasons,
  securityEvents,
}) {
  return (
    <section aria-label="Dashboard analytics" className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-gray-900">Security analytics</h2>
        <p className="text-xs text-gray-500">Live updates on detections · refreshes every 15–30s</p>
      </div>

      <TrafficClassificationChart
        series={classificationSeries}
        granularity={classificationGranularity}
        onGranularityChange={onGranularityChange}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <RiskHeatmapChart buckets={riskHeatmap?.buckets} total={riskHeatmap?.total} />
        <DetectionFunnel stages={detectionFunnel?.stages} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <TopReasonsList reasons={topReasons} />
        <RecentSecurityEvents events={securityEvents} />
      </div>
    </section>
  );
}

export default memo(DashboardAnalytics);
