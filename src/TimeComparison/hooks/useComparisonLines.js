import shallow from "zustand/shallow";
import { useLocationStore } from "../../Locations";
import useLocationSeries from "../../Locations/hooks/useLocationSeries";
import { groupByMonth } from "../../TimeSeries";
import useDashboardStore from "../../Dashboard/hooks/useDashboardStore";
import { TIME_COMPARISON_LINE_COLORS } from "../../Dashboard/constants";

const splitDataByYear = (years, data) => {
  const dataByYear = {};
  years.forEach((year) => {
    dataByYear[year] = data.filter((d) => d.date.includes(year));
  });
  return dataByYear;
};

const getYears = (currentYear) => {
  const years = [];
  for (let i = 2019; i <= currentYear; i++) {
    years.push(`${i}`);
  }
  return years;
};

const buildDateRange = (latestData) => {
  return [`2019-01-01`, `${latestData}`];
};

const averageForYear = (data) => {
  return data.reduce((prev, curr) => {
    return prev + curr.ef;
  }, 0);
};

/**
 * A hook that returns the lines used for time comparison charts
 * @param {string} featureId - the id of the geography detailed in the panel
 * @param {string} compareToYear - the year to compare to
 * @param {object} labelOverrides - if non-standard labels are desired for a year, e.g {2019: '2019 (Pre-COVID)'}
 * @param {string} view - count or relative, stateful
 */

export default function useComparisonLines(
  featureId,
  compareToYear,
  labelOverrides,
  view
) {
  const colors = TIME_COMPARISON_LINE_COLORS;
  const [locations] = useLocationStore((state) => [
    state.locations,
    state.active,
  ]);
  const allDateRange = useDashboardStore((state) => state.dateRange, shallow);
  const dateRange = buildDateRange(allDateRange[1]);
  const years = getYears(allDateRange[1].substr(0, 4));
  const locationSeries = useLocationSeries(locations, dateRange);
  const series = locationSeries?.map((location) => {
    if (!location?.data?.series) return [];
    const data = location.data.series;
    const dataByYear = splitDataByYear(years, data);
    return {
      id: location.data.id,
      data: Object.keys(dataByYear).map((year) =>
        groupByMonth(dataByYear?.[year], "ef")
      ),
    };
  });
  const activeLocation = series?.find((line) => line?.id === `${featureId}`);
  //if comparing to a specific year, log data for that year
  const compareToYearData = activeLocation?.data?.find(
    (year, index) => compareToYear === years[index]
  );
  //while data loads (compareToYearData is undefined), assume canCompare will be true
  const canCompare = compareToYearData
    ? !!compareToYearData.reduce((prev, curr) => {
        return prev + curr.ef;
      }, 0)
    : true;
  let lines = [];
  activeLocation?.data.forEach((year, yrIndex) => {
    //groupbymonth is returning backwards array (december first)
    year.reverse();
    if (averageForYear(year) > 0 && year.length > 1) {
      lines.push({
        id: `${years[yrIndex]}`,
        color:
          compareToYear === years[yrIndex] && view === "relative"
            ? "#000"
            : colors[yrIndex % colors.length],
        data: year.map((month, mIndex) => {
          return {
            date: `2000-${month.date.substr(5, 9)}`,
            ef: compareToYearData
              ? view === "relative"
                ? (month.ef / compareToYearData[mIndex].ef - 1) * 100
                : month.ef
              : month.ef,
            name: years[yrIndex],
          };
        }),
        visible: true,
        dashArray:
          compareToYear === years[yrIndex] && view === "relative" ? "4,4" : "",
        legendLabel: labelOverrides[years[yrIndex]]
          ? labelOverrides[years[yrIndex]]
          : `${years[yrIndex]}`,
      });
    }
  });
  return { lines, canCompare };
}
