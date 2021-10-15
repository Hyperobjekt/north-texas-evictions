import { timeDays } from "d3-time";
import { useEffect } from "react";
import { formatDate, useDashboardStore } from "../../Dashboard";
import useSummaryData from "../../Data/useSummaryData";
import { useLocationStore } from "../../Locations";
import useLocationColors from "../../Locations/hooks/useLocationColors";
import useLocationSeries from "../../Locations/hooks/useLocationSeries";
import useTimeSeriesStore from "./useTimeSeriesStore";

// TODO: refactor this function and use one of the d3 utils instead
//eslint-disable-next-line
Date.prototype.getWeek = function () {
  // We have to compare against the first monday of the year not the 01/01
  // 60*60*24*1000 = 86400000
  // 'onejan_next_monday_time' reffers to the miliseconds of the next monday after 01/01

  var day_miliseconds = 86400000,
    onejan = new Date(this.getFullYear(), 0, 1, 0, 0, 0),
    onejan_day = onejan.getDay() === 0 ? 7 : onejan.getDay(),
    days_for_next_monday = 8 - onejan_day,
    onejan_next_monday_time =
      onejan.getTime() + days_for_next_monday * day_miliseconds,
    // If one jan is not a monday, get the first monday of the year
    first_monday_year_time =
      onejan_day > 1 ? onejan_next_monday_time : onejan.getTime(),
    this_date = new Date(
      this.getFullYear(),
      this.getMonth(),
      this.getDate(),
      0,
      0,
      0
    ), // This at 00:00:00
    this_time = this_date.getTime(),
    days_from_first_monday = Math.round(
      (this_time - first_monday_year_time) / day_miliseconds
    );

  // We add 1 to "days_from_first_monday" because if "days_from_first_monday" is *7,
  // then 7/7 = 1, and as we are 7 days from first monday,
  // we should be in week number 2 instead of week number 1 (7/7=1)
  // We consider week number as 52 when "days_from_first_monday" is lower than 0,
  // that means the actual week started before the first monday so that means we are on the firsts
  // days of the year (ex: we are on Friday 01/01, then "days_from_first_monday"=-3,
  // so friday 01/01 is part of week number 52 from past year)
  // "days_from_first_monday<=364" because (364+1)/7 == 52, if we are on day 365, then (365+1)/7 >= 52 (Math.ceil(366/7)=53) and thats wrong

  return days_from_first_monday >= 0 && days_from_first_monday < 364
    ? Math.ceil((days_from_first_monday + 1) / 7)
    : 52;
};

/**
 * Accepts data by day and aggregates it by week
 */
function groupByWeek(data) {
  const grouped = {};
  data.forEach((d) => {
    const date = new Date(d.date);
    const week = date.getWeek();
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
function groupByMonth(data) {
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
function movingAverage(series, dateRange, N = 7) {
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
  console.log({ avgDict });
  return series.map((d, i) => {
    return {
      ...d,
      ef: avgDict[d.date],
    };
  });
}

/**
 * Returns an array of line data for the time series based on the current
 * dashboard state, including the "all data" line toggle, pinned locations,
 * and active date range.
 * @returns
 */
export default function useTimeSeriesLines() {
  const { data: summary, status } = useSummaryData();
  const overallDataReady = status === "success";
  const dateRange = useDashboardStore((state) => state.activeDateRange);
  const showOverall = useTimeSeriesStore((state) => state.showOverall);
  const setShowOverall = useTimeSeriesStore((state) => state.setShowOverall);
  const group = useTimeSeriesStore((state) => state.group);
  const pinnedLocations = useLocationStore((state) => state.pinned);
  const pinnedColors = useLocationColors(pinnedLocations);
  const locationSeries = useLocationSeries(pinnedLocations, dateRange);
  const numLocations = pinnedLocations.length;

  // ensure that the "overall" data is on if there are no pinned locatons
  useEffect(() => {
    if (numLocations === 0 && !showOverall) setShowOverall(true);
  }, [numLocations, showOverall, setShowOverall]);

  // line for "overall data"
  const overallLine = {
    id: "overall",
    color: "#f00",
    data:
      showOverall && overallDataReady
        ? group === "weekly"
          ? groupByWeek(summary.series)
          : group === "monthly"
          ? groupByMonth(summary.series)
          : group === "avg7"
          ? movingAverage(summary.series, dateRange, 7)
          : group === "avg30"
          ? movingAverage(summary.series, dateRange, 30)
          : summary.series
        : [],
    visible: true,
  };

  // lines for pinned locations
  const locationLines = locationSeries.map(({ data, isSuccess }, i) => ({
    id: pinnedLocations[i].properties.id,
    color: pinnedColors[i],
    data: isSuccess
      ? group === "weekly"
        ? groupByWeek(data.series)
        : group === "monthly"
        ? groupByMonth(data.series)
        : group === "avg7"
        ? movingAverage(data.series, dateRange, 7)
        : group === "avg30"
        ? movingAverage(data.series, dateRange, 30)
        : data.series
      : [],
    visible: isSuccess,
  }));

  return [overallLine, ...locationLines];
}
