import useLocationSeries from "../Locations/hooks/useLocationSeries";
import { useFormatters } from "../Dashboard/hooks/useFormatter";
import { useLang } from "../Language";

export default function useSelectedLocationData(selectedLocations, dateRange) {
  const statsReducer = (prev, curr) => {
    let result = { data: {} };
    const locationKeys = Object.keys(prev.data);
    locationKeys.forEach((locationKey) => {
      if (locationKey !== "id" && locationKey !== "series") {
        result.data[locationKey] =
          prev.data[locationKey] + curr.data[locationKey];
      }
    });
    return result;
  };

  const seriesReducer = (prev, curr) => {
    let result = { data: { series: [] } };
    result.data.series = prev.data.series.map((day, index) => {
      const dayKeys = Object.keys(day);
      let combinedDay = {};
      dayKeys.forEach((dayKey) => {
        if (dayKey !== "date" && dayKey !== "name" && dayKey !== "id") {
          combinedDay[dayKey] = day[dayKey] + curr.data?.series[index][dayKey];
        } else if (dayKey === "name") {
          combinedDay[dayKey] = "selectedLocations";
        } else {
          combinedDay[dayKey] = day[dayKey];
        }
      });
      return combinedDay;
    });
    return result;
  };

  const locationsData = useLocationSeries(selectedLocations, dateRange);
  let isReady = 0;
  locationsData.forEach((location) => {
    if (location.status === "success") {
      isReady++;
    }
  });
  let selectedSeries;
  let selectedStatsRaw;
  if (isReady === locationsData.length && locationsData.length > 0) {
    selectedSeries = locationsData.reduce(seriesReducer);
    selectedStatsRaw = locationsData.reduce(statsReducer);
  }
  return { selectedSeries, selectedStatsRaw };
}
