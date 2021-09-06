import useDashboardStore from "../../Dashboard/hooks/useDashboardStore";
import { useLang } from "../../Language";

export default function useMetricOptions() {
  const metrics = useDashboardStore((state) => state.metrics);
  const metricLabels = useLang(
    metrics.map((m) => `METRIC_${m.id}`.toUpperCase())
  );
  return metrics.map((m, i) => ({
    label: metricLabels[i],
    ...m,
  }));
}
