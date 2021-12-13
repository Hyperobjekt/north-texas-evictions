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
  const locations = useLocationStore((state) => state.locations);
  // TODO: do not hardcode end date
  const locationSeries = useLocationSeries(locations, [
    "2019-01-02",
    "2021-12-31",
  ]);
  const series = locationSeries.map((location) => {
    if (!location?.data?.series) return [];
    const data = location.data.series;
    const dataByYear = splitDataByYear(data);
    return dataByYear;
  });
  const byMonth =
    series?.[0]?.["2019"] && groupByMonth(series?.[0]?.["2019"], "ef");

  console.log({ series, locationSeries, byMonth });
  return [
    {
      id: "overall",
      color: "#f00",
      data: [
        { date: new Date("2018-01-01"), value: 0.5 },
        { date: new Date("2018-01-02"), value: 0.6 },
        { date: new Date("2018-01-03"), value: 0.7 },
        { date: new Date("2018-01-04"), value: 0.8 },
        { date: new Date("2018-01-05"), value: 0.9 },
      ],
      visible: true,
    },
  ];
}
