import { sum } from "d3-array";
import { timeDay } from "d3-time";
import { movingAverage } from "..";
import { parseDate } from "../../Dashboard";

export const getTrendLineInterval = (series, dateRange, metric) => {
  const dayCount = timeDay.count(...dateRange.map(parseDate));
  const total = sum(series, (d) => d[metric]);
  const avg = total / dayCount;
  // override the trend line interval if the avg filings / day is less than 1.
  // this prevents using the 7-day moving average when it would result in a flat line
  // for areas with low filings per day
  const intervalOverride = avg < 1 ? "day" : false;
  // NOTE: the lines below would return a different trend line based on the total range of dates
  //       this has been removed for now, because it can be misleading at the tract level where
  //       it looks like 0 evictions have happened over the time period
  return intervalOverride || dayCount < 14 ? "day" : "week";
};

/**
 * Returns an array of data for the trend line based on the
 * given date range.
 *
 * - < 7 days: returns the last 7 days of data
 * - > 7 days: returns the 7 day average per day
 * - > 120 days: returns the 30 day average per day
 * @param {*} series
 * @param {*} dateRange
 */
export default function useTrendSeries(series, dateRange, metric = "ef") {
  if (!series || series.length === 0) {
    return [];
  }
  const interval = getTrendLineInterval(series, dateRange, metric);
  switch (interval) {
    case "week":
      return [movingAverage(series, metric, dateRange, 7), interval];
    default:
      return [series, interval];
  }
}
