import { useFormatters } from "../../Dashboard/hooks/useFormatter";
import { useLang } from "../../Language";

const STAT_METRICS = ["avg7", "avg30", "efr", "tfa", "mfa"];

/**
 * Gets an array of eviction summary stats from the location data
 * @param {*} location
 * @returns
 */
export default function useSummaryStats(data, metricIds = STAT_METRICS) {
  data = data || {};
  const langKeys = metricIds.map((id) => `METRIC_${id}`.toUpperCase());
  const labels = useLang(langKeys);
  const formatters = useFormatters(metricIds);
  const hintKeys = metricIds.map((id) => `HINT_${id}`.toUpperCase());
  const hints = useLang(hintKeys);
  return metricIds.map((id, i) => {
    const diffKey = id === "avg7" ? "diff7" : id === "avg30" ? "diff30" : null;
    return {
      id,
      label: labels[i],
      hint: hints[i],
      value: formatters[i](data[id]),
      diff: diffKey ? data[diffKey] : null,
    };
  });
  // .filter(({ value }) => Boolean(value));
}
