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
  //console.log(locationSeries)
  const byMonth =
    series?.[0]?.["2019"] && groupByMonth(series?.[0]?.["2019"], "ef");
  const dataForPlot = byMonth?.map(month => {
    return {date: new Date(month.date), value: month.ef}
  });
  const dataForPlotSeries = series[0]?.data?.series?.map(day => {
    return {date: new Date(day.date), value: day.ef}
  });
  console.log(series.map(s => s.data.series))
  return [
    {
      id: "overall",
      color: "#f00",
      data: dataForPlotSeries ? dataForPlotSeries : [],
      visible: true,
    },
  ];
}
