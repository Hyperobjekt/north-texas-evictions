import { useLocationStore } from "../../Locations";
import useLocationSeries from "../../Locations/hooks/useLocationSeries";
import { groupByMonth } from "../../TimeSeries";

const splitDataByYear = (years, data) => {
  const dataByYear = {};
  years.forEach((year) => {
    dataByYear[`${year}`] = data.filter((d) => d.date.includes(`${year}`));
  });
  return dataByYear;
};

const buildDateRange = (years) => {
  years.sort((a, b) => a - b);
  return [`${years[0]}-01-01`, `${years[years.length - 1]}-12-31`];
}

/**
 * A hook that returns the lines used for time comparison charts
 * @param {number[]} years
 * @param {{}} active
 * @param {string[]} colors
 */
export default function useComparisonLines(years, colors) {
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
  const activeLocationPlot = activeLocation?.data.map((year, index) => {
    return {
      id: years[index],
      index: index,
      color: colors[index],
      data: year.map(month => {
        return {date: `2001-${month.date.substr(5,9)}`, value: month.ef, name: years[index],}
      }),
      visible: true,
    }
  });
  return activeLocationPlot;
}
