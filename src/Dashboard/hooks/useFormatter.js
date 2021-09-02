import { format } from "d3-format";
import useDashboardStore from "./useDashboardStore";

/**
 * Returns a function for formatting values for the current metric
 * @param {*} metric
 * @returns
 */
export default function useFormatter(metric, options = { short: false }) {
  const metrics = useDashboardStore((state) => state.metrics);
  const metricConfig = metrics.find((m) => m.id === metric);

  if (!metrics || !metricConfig) return format(".2f");

  switch (metricConfig.format) {
    case "percent":
      return format(".1%");
    case "number":
      return format(".2s");
    case "currency":
      return options.short ? format("$.2~s") : format("$,.2f");
    case "integer":
      return options.short ? format(".2~s") : format(",d");
    default:
      return format(".2s");
  }
}
