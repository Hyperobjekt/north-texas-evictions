import { timeDay } from "d3-time";
import { movingAverage } from "..";
import { parseDate } from "../../Dashboard";

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
export default function useTrendSeries(series, dateRange) {
  if (!series || series.length === 0) {
    return [];
  }
  const daysBetween = timeDay.count(...dateRange.map(parseDate));
  return daysBetween > 14
    ? movingAverage(series, dateRange, 7)
    : daysBetween > 120
    ? movingAverage(series, dateRange, 30)
    : series;
}
