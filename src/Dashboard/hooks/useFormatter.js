import { format as d3format } from "d3-format";
import useDashboardStore from "./useDashboardStore";

/**
 * Returns a formatter function for the given format string
 * and also formats invalid values
 */
const format = (formatString) => {
  const formatter = d3format(formatString);
  return (value) => {
    if (!Number.isFinite(value)) return "--";
    return formatter(value);
  };
};

/**
 * Returns a formatter function for the given format string.
 * @param {*} format
 * @param {*} options
 * @returns
 */
export const getFormatter = (type, options = { short: false }) => {
  switch (type) {
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
};

/**
 * Returns a function for formatting values for the current metric
 * @param {*} metric
 * @returns
 */
export default function useFormatter(metric, options = { short: false }) {
  const metrics = useDashboardStore((state) => state.metrics);
  const metricConfig = metrics.find((m) => m.id === metric);
  if (!metrics || !metricConfig) return format(".2f");
  return getFormatter(metricConfig.format, options);
}

/** Returns formatters for the given metrics */
export function useFormatters(metrics, options) {
  const metricConfigs = useDashboardStore((state) => state.metrics);
  const formatters = metrics.map((metric) => {
    const metricConfig = metricConfigs.find((m) => m.id === metric);
    if (!metrics || !metricConfig) return format(".2f");
    return getFormatter(metricConfig.format, options);
  });
  return formatters;
}
