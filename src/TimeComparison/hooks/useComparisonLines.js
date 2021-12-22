import { useLocationStore } from "../../Locations";
import useLocationSeries from "../../Locations/hooks/useLocationSeries";
import { groupByMonth } from "../../TimeSeries";

const splitDataByYear = (data) => {
  const years = ["2019", "2020", "2021"];
  const dataByYear = {};
  years.forEach((year) => {
    dataByYear[year] = data.filter((d) => d.date.includes(year));
  });
  return dataByYear;
};

/**
 * A hook that returns the lines used for time comparison charts
 */
export default function useComparisonLines(view) {
  const [
    active, 
    locations,
  ] = useLocationStore((state) => 
    [
      state.active,
      state.locations
    ],
  );
  // TODO: do not hardcode end date
  const locationSeries = useLocationSeries([active], [
    "2019-01-02",
    "2021-12-31",
  ]);
  const series = locationSeries.map((location) => {
    if (!location?.data?.series) return [];
    const data = location.data.series;
    const dataByYear = splitDataByYear(data);
    return dataByYear;
  });
  const byMonths = Object.keys(series[0]).map((year) => groupByMonth(series?.[0]?.[year], "ef"))
  const colors = ['#f00', '#0f0', '#00f'];
  const arrayForPlot = byMonths?.map((year, index) => {
    return {
      id: Object.keys(series[0])[index],
      color: colors[index],
      data: year.map(month => {
        return {date: new Date(month.date.substr(5,9)), value: month.ef}
      }),
      visible: true,
    }
  });
  return arrayForPlot;
}
