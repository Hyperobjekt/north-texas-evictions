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
 * Returns short format for large integers (e.g. 1.2M)
 * but keeps numbers below 1000 as normal integers (e.g. 531)
 * @param {number} value
 * @returns {string}
 */
const shortIntFormatter = (value) => {
  const smallIntFormatter = format(",d");
  const largeIntFormatter = format(".2~s");
  if (value < 1000) {
    return smallIntFormatter(value);
  }
  return largeIntFormatter(value);
};

/**
 * Returns short format for large currencies (e.g. $1.2M)
 * but keeps numbers below 1000 as integers (e.g. $531)
 * @param {number} value
 * @returns {string}
 */
const shortCurrencyFormatter = (value) => {
  const smallFormatter = format("$,d");
  const largeFormatter = format("$.2~s");
  if (value < 1000) {
    return smallFormatter(value);
  }
  return largeFormatter(value);
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
      return options.short ? format(".0%") : format(".1%");
    case "number":
      return format(".2s");
    case "currency":
      return options.short ? shortCurrencyFormatter : format("$,.0f");
    case "integer":
      return options.short ? shortIntFormatter : format(",d");
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
