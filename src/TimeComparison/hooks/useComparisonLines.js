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
 * @param {string} featureId - the id of the geography detailed in the panel
 * @param {string[]} years - the years to compare
 * @param {string[]} colors - the color of line for each year
 * @param {string} compareTo - the year to compare to
 */

export default function useComparisonLines(featureId, years, colors, compareToYear, view) {
  const [locations] = useLocationStore((state) => [state.locations, state.active]);
  const dateRange = buildDateRange(years)
  const locationSeries = useLocationSeries(locations, dateRange);
  const series = locationSeries?.map((location) => {
    if (!location?.data?.series) return []
    const data = location.data.series;
    const dataByYear = splitDataByYear(years, data);
    return {id: location.data.id, data: Object.keys(dataByYear).map((year) => groupByMonth(dataByYear?.[year], "ef"))};
  });
  const activeLocation = series?.find((line) => line?.id === `${featureId}`);
  //if comparing to a specific year, log data for that year
  const compareToYearData = activeLocation?.data?.find((year, index) => compareToYear === years[index])

  const activeLocationPlot = activeLocation?.data.map((year, yrIndex) => {
    //groupbymonth is returning backwards array (december first)
    year.reverse();
    return {
      id: `${years[yrIndex]}`,
      color: compareToYear ===  `${years[yrIndex]}` ? '#000' : colors[yrIndex],
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
