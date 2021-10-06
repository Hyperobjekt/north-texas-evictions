import useDashboardStore from "./useDashboardStore";
import { useLang } from "../../Language";

export default function useMetricOptions() {
  const metrics = useDashboardStore((state) => state.metrics);
  const activeRegion = useDashboardStore((state) => state.activeRegion);
  const metricLabels = useLang(
    metrics.map((m) => `METRIC_${m.id}`.toUpperCase())
  );
  return metrics.map((m, i) => ({
    ...m,
    label: metricLabels[i],
    unavailable: m.unavailable && m.unavailable.includes(activeRegion),
  }));
}
