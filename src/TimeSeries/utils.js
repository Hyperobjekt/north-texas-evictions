import { ContactsOutlined } from "@material-ui/icons";
import { timeDay, timeSunday } from "d3-time";
import { timeFormat } from "d3-time-format";
import { formatDate, parseDate } from "../Dashboard";

// returns the year for a given date
const yearFormat = timeFormat("%Y");

// Short format day formatter for ticks (e.g. "Mar 1")
const dayTickFormat = timeFormat("%b %d");

// short format day formatter for ticks with year (e.g. "Mar 1, '17")
const dayTickYearFormat = timeFormat("%b %d, '%y");

// Long format day formatter for tooltips (e.g. "March 1, 2017")
const dayTooltipFormat = timeFormat("%B %d, %Y");

const dayTickFormatter = (includeYear) =>
  includeYear ? dayTickYearFormat : dayTickFormat;

// Short format week for ticks (e.g. "Mar 1 - 7")
const weekTickFormat = (includeYear) => (date) => {
  // if multi-year, use shorter tick format with year for single day
  if (includeYear) return dayTickYearFormat(date);
  // if within the same year, use longer tick format
  const formatter = dayTickFormat;
  const sunday1 = timeSunday.floor(date);
  const sunday2 = timeSunday.offset(sunday1, 1);
  return formatter(sunday1) + " - " + formatter(sunday2);
};

// Long format week formatter
const weekTooltipFormat = (date) => {
  const sunday1 = timeSunday.floor(date);
  const sunday2 = timeSunday.offset(sunday1, 1);
  const year1 = yearFormat(sunday1);
  const year2 = yearFormat(sunday2);
  const isDifferentYear = year1 !== year2;
  return isDifferentYear
    ? `${dayTickFormat(sunday1)}, ${year1} - ${dayTickFormat(
        sunday2
      )}, ${year2}`
    : `${dayTickFormat(sunday1)} - ${dayTickFormat(sunday2)}, ${year1}`;
};

// month tooltip formatter
const monthTooltipFormat = (includeYear) => {
  return includeYear ? timeFormat("%B %Y") : timeFormat("%B");
};

/**
 * Returns a x tick formatter function for the provided group type
 * @param {*} group
 * @returns
 */
export const getXTickFormatter = ({ group, includeYear }) => {
  switch (group) {
    case "weekly":
      return weekTickFormat(includeYear);
    case "monthly":
      return includeYear ? timeFormat("%b '%y") : timeFormat("%b");
    default:
      return dayTickFormatter(includeYear);
  }
};

/**
 * Returns a x value tooltip formatter function for the provided group type
 * @param {*} group
 * @returns
 */
export const getXTooltipFormatter = (group, includeYear) => {
  switch (group) {
    case "weekly":
      return weekTooltipFormat;
    case "monthly":
      return monthTooltipFormat(includeYear);
    default:
      return dayTooltipFormat;
  }
};

/**
 * Accepts data by day and aggregates it by week
 */
export function groupByWeek(data, metric = "ef") {
  const grouped = {};
  data.forEach((d) => {
    const date = timeSunday.floor(parseDate(d.date));
    const week = formatDate(date);
    if (!grouped[week]) {
      grouped[week] = {
        ...d,
        date: week,
        [metric]: 0,
      };
    }
    if (d[metric]) grouped[week][metric] += d[metric];
  });
  return Object.values(grouped).sort((a, b) => (a.date > b.date ? -1 : 1));
}

/**
 * Accepts data by day and aggregates it by month
 */
export function groupByMonth(data, metric = "ef") {
  const grouped = {};
  data.forEach((d) => {
    //dates are converted to local time, add timezone offset to get UTC
    const date = new Date(d.date + "T00:00:00");
    const month = date.getMonth();
    const year = date.getFullYear();
    const key = `${year}-${month + 1}`;
    if (!grouped[key]) {
      grouped[key] = {
        ...d,
        date: formatDate(new Date(date.getFullYear(), date.getMonth(), 1, 12)),
        [metric]: 0,
      };
    }
    if (d[metric]) grouped[key][metric] += d[metric];
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
export function movingAverage(series, metric = "ef", dateRange, N = 7) {
  // create an array of all days in the date range
  const allDays = series.map((d) => parseDate(d.date));
  // map a value for each day in the date range
  const values = series.map((entry) => entry[metric]);
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

  // round eviction filings to nearest whole number
  const rounder = metric === "ef" ? Math.round : (v) => v;

  // create a dictionary of date to value
  const avgDict = allDays.reduce((dict, day, i) => {
    dict[formatDate(day)] = rounder(means[i]);
    return dict;
  }, {});

  // add the moving average to the original series
  const result = series.map((d, i) => {
    return {
      ...d,
      [metric]: avgDict[d.date],
    };
  });
  return result;
}

/**
 * Takes the average of the last `n` values in the provided array.
 * Assumes that the provided array is in chronological order.
 * @param {*} data
 * @param {*} n
 * @returns
 */
export const getDailyAverage = (metric, data, n = 7, offset = 0) => {
  if (!data || data.length < n + offset) return null;
  const start = offset;
  const end = offset + n;
  const avg =
    [...data]
      .sort((a, b) => parseDate(b.date) - parseDate(a.date))
      .slice(start, end)
      .reduce((acc, curr) => {
        return acc + curr[metric];
      }, 0) / n;
  return avg;
};

export const getDaysBetween = (dateRange) =>
  timeDay.count(...dateRange.map(parseDate));

/**
 * Returns false if the eventDates date range falls outside
 * of the rangeDates date range, or true if there is some overlap.
 * @param {Date} eventDates
 * @param {Date} rangeDates
 * @returns
 */
export const isEventInRange = (eventDates, rangeDates) => {
  return !(
    (eventDates.start < rangeDates.start &&
      eventDates.end < rangeDates.start) ||
    (eventDates.start > rangeDates.end && eventDates.end > rangeDates.end)
  );
};

export const doesEventOverlap = (eventDates, rangeDates) => {
  if (!isEventInRange(eventDates, rangeDates)) return false;
  const isEventPoint =
    eventDates.start.toISOString() === eventDates.end.toISOString();
  const isRangePoint =
    rangeDates.start.toISOString() === rangeDates.end.toISOString();
  // if neither event nor range is a point, they overlap
  if (!isEventPoint && !isRangePoint) return true;
  // thus, the range or event is a point, and if one of their starts or ends is the same, they overlap
  return (
    eventDates.start.toISOString() === rangeDates.start.toISOString() ||
    eventDates.end.toISOString() === rangeDates.end.toISOString()
  );
};

export const dateToString = (date) => {
  return;
};

export const createTiers = (events) => {
  return events.reduce((tiers, event) => {
    let fits = null;
    //if the levels array has already been populated
    if (tiers.length > 0) {
      //check every tier in the tiers array
      for (let index = 0; index < tiers.length; index++) {
        const tier = tiers[index];
        let isOverlapping = false;
        //check every range in the current tier
        for (let i = 0; i < tier.length; i++) {
          const range = tier[i];
          if (doesEventOverlap(event, range)) {
            isOverlapping = true;
            break;
          }
          //if none of the ranges in the tier overlap with the event (or if the event is a single date), set the fits var to the index of the tier and stop checking
        }
        if (!isOverlapping) {
          fits = index;
          break;
        }
      }
      //if the fits var was set to a level index, add the event to that level
      if (fits !== null) {
        tiers[fits].push(event);
        //else make a new level with the event
      } else {
        tiers.push([event]);
      }
      //if the levels array is empty, create a new level with the event
    } else {
      tiers.push([event]);
    }
    return tiers;
  }, []);
};

export const processDates = (events, range) => {
  const rangeDates = { start: new Date(range[0]), end: new Date(range[1]) };
  console.log(events);
  const dates = events.reduce((dates, event) => {
    const start =
      event.start < rangeDates.start ? rangeDates.start : event.start;
    const end = event.end > rangeDates.end ? rangeDates.end : event.end;
    const color = event.color;
    const id = event.id;
    const name = event.name;
    dates.push({ start, end, color, id, name });
    return dates;
  }, []);
  return dates;
};
