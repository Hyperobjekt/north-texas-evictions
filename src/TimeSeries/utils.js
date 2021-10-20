import { timeDay, timeDays, timeSunday, timeYear } from "d3-time";
import { formatDate, parseDate } from "../Dashboard";

/**
 * Accepts data by day and aggregates it by week
 */
export function groupByWeek(data) {
  const grouped = {};
  data.forEach((d) => {
    const date = new Date(d.date);
    const week = timeSunday.count(timeYear(date), date);
    if (!grouped[week]) {
      grouped[week] = {
        date: formatDate(
          new Date(date.getFullYear(), date.getMonth(), date.getDate())
        ),
        ef: 0,
      };
    }
    grouped[week].ef += d.ef;
  });
  return Object.values(grouped).sort((a, b) => (a.date > b.date ? -1 : 1));
}

/**
 * Accepts data by day and aggregates it by month
 */
export function groupByMonth(data) {
  const grouped = {};
  data.forEach((d) => {
    const date = new Date(d.date);
    const month = date.getMonth();
    if (!grouped[month]) {
      grouped[month] = {
        date: formatDate(
          new Date(date.getFullYear(), date.getMonth(), date.getDate())
        ),
        ef: 0,
      };
    }
    grouped[month].ef += d.ef;
  });
  return Object.values(grouped).sort((a, b) => (a.date > b.date ? -1 : 1));
}

/**
 * Calulates the moving average given the array of values,
 * date range, and number of days (N)
 * https://observablehq.com/@d3/moving-average
 * @param {*} values
 * @param {*} N
 * @returns
 */
export function movingAverage(series, dateRange, N = 7) {
  const allDays = timeDays(new Date(dateRange[0]), new Date(dateRange[1]));
  const values = allDays.map((day) => {
    const match = series.find((d) => {
      return d.date === formatDate(day);
    });
    return match ? match.ef : 0;
  });
  let i = 0;
  let sum = 0;
  const means = new Float64Array(values.length).fill(NaN);
  for (let n = Math.min(N - 1, values.length); i < n; ++i) {
    sum += values[i];
  }
  for (let n = values.length; i < n; ++i) {
    sum += values[i];
    means[i] = sum / N;
    sum -= values[i - N + 1];
  }
  const avgDict = allDays.reduce((dict, day, i) => {
    dict[formatDate(day)] = means[i];
    return dict;
  }, {});
  return series.map((d, i) => {
    return {
      ...d,
      ef: avgDict[d.date],
    };
  });
}

/**
 * Takes the average of the last `n` values in the provided array.
 * Assumes that the provided array is in chronological order.
 * @param {*} data
 * @param {*} n
 * @returns
 */
export const getDailyAverage = (data, n = 7, offset = 0) => {
  if (!data || data.length < n + offset) return null;

  const start = offset;
  const end = offset + n;
  const avg =
    data.slice(start, end).reduce((acc, curr) => {
      return acc + curr.ef;
    }, 0) / n;
  return avg;
};

export const getDaysBetween = (dateRange) =>
  timeDay.count(...dateRange.map(parseDate));
