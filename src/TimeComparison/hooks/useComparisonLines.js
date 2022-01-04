import { getCurrentRouteParams } from "../../HashRouter";
import { useLocationStore } from "../../Locations";
import useLocationSeries from "../../Locations/hooks/useLocationSeries";
import { groupByMonth } from "../../TimeSeries";

const splitDataByYear = (years, data) => {
  const dataByYear = {};
  years.forEach((year) => {
    dataByYear[year] = data.filter((d) => d.date.includes(year));
  });
  return dataByYear;
};

const buildDateRange = (years) => {
  years.sort((a, b) => a - b);
  return [`${years[0]}-01-01`, `${years[years.length - 1]}-12-31`];
}

/**
 * A hook that returns the lines used for time comparison charts
 * @param {string[]} years
 * @param {string[]} colors
 * @param {string} compareTo

 */
export default function useComparisonLines(years, colors, compareToYear) {
  const [locations, active] = useLocationStore((state) => [state.locations, state.active]);
  const dateRange = buildDateRange(years)
  const locationSeries = useLocationSeries(locations, dateRange);
  const series = locationSeries?.map((location) => {
    if (!location?.data?.series) return []
    const data = location.data.series;
    const dataByYear = splitDataByYear(years, data);
    return {id: location.data.id, data: Object.keys(dataByYear).map((year) => groupByMonth(dataByYear?.[year], "ef"))};
  });
  const activeLocation = series?.find((line) => line?.id === `${active?.id}`);
  //if comparing to a specific year, log data for that year
  const compareToYearData = activeLocation?.data?.find((year, index) => compareToYear === years[index])

  const activeLocationPlot = activeLocation?.data.map((year, yrIndex) => {
    //groupbymonth is returning backwards array (december first)
    year.reverse();
    return {
      id: `${years[yrIndex]}`,
      color: colors[yrIndex],
      data: year.map((month, mIndex) => {
        return {
          date: `2000-${month.date.substr(5,9)}`, 
          ef: compareToYearData ? (compareToYear ? ((month.ef / compareToYearData[mIndex].ef) - 1) * 100 : month.ef) : month.ef, 
          name: years[yrIndex]
        }
      }),
      visible: true,
      dashArray: compareToYear === years[yrIndex] ? "5,5" : "",
    }
  });
  return activeLocationPlot;
}
