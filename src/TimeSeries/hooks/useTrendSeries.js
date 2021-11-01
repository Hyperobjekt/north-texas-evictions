// import { timeDay } from "d3-time";
// import { groupByMonth, groupByWeek, movingAverage } from "..";
// import { parseDate } from "../../Dashboard";

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
  return series;
  // NOTE: the lines below would return a different trend line based on the total range of dates
  //       this has been removed for now, because it can be misleading at the tract level where
  //       it looks like 0 evictions have happened over the time period
  // const daysBetween = timeDay.count(...dateRange.map(parseDate));
  // return daysBetween < 14
  //   ? series
  //   : daysBetween < 120
  //   ? movingAverage(series, metric, dateRange, 7)
  //   : movingAverage(series, metric, dateRange, 30);
}
