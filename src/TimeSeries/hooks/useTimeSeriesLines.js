import { useEffect } from "react";
import { groupByMonth, groupByWeek, movingAverage } from "..";
import { parseDate, useDashboardStore } from "../../Dashboard";
import { ALL_DATA_COLOR } from "../../Dashboard/constants";
import useSummaryData from "../../Data/useSummaryData";
import { useLocationStore } from "../../Locations";
import useLocationColors from "../../Locations/hooks/useLocationColors";
import useLocationSeries from "../../Locations/hooks/useLocationSeries";
import useTimeSeriesStore from "./useTimeSeriesStore";

const getLineData = ({ series, group, dateRange, metric }) => {
  const data =
    group === "weekly"
      ? groupByWeek(series, metric)
      : group === "monthly"
      ? groupByMonth(series, metric)
      : group === "avg7"
      ? movingAverage(series, metric, dateRange, 7)
      : group === "avg30"
      ? movingAverage(series, metric, dateRange, 30)
      : series;
  return data.sort((a, b) => parseDate(a.date) - parseDate(b.date));
};

/**
 * Returns an array of line data for the time series based on the current
 * dashboard state, including the "all data" line toggle, pinned locations,
 * and active date range.
 * @returns
 */
export default function useTimeSeriesLines() {
  const { data: summary, status } = useSummaryData();
  const overallDataReady = status === "success";
  const activeBubble = useDashboardStore((state) => state.activeBubble);
  const dateRange = useDashboardStore((state) => state.activeDateRange);
  const showOverall = useTimeSeriesStore((state) => state.showOverall);
  const setShowOverall = useTimeSeriesStore((state) => state.setShowOverall);
  const group = useTimeSeriesStore((state) => state.group);
  const locations = useLocationStore((state) => state.locations);
  const pinnedLocations = useLocationStore((state) => state.pinned);
  const locationColors = useLocationColors(locations);
  const locationSeries = useLocationSeries(locations, dateRange);
  const numLocations = pinnedLocations.length;

  // ensure that the "overall" data is on if there are no pinned locatons
  useEffect(() => {
    if (numLocations === 0 && !showOverall) setShowOverall(true);
  }, [numLocations, showOverall, setShowOverall]);

  // line for "overall data"
  const overallLine = {
    id: "overall",
    color: ALL_DATA_COLOR,
    data:
      showOverall && overallDataReady
        ? getLineData({
            series: summary.series,
            group,
            metric: activeBubble,
            dateRange,
          })
        : [],
    visible: true,
  };

  // lines for pinned locations
  const locationLines = locationSeries.map(({ data, isSuccess }, i) => {
    const isPinned =
      pinnedLocations.findIndex(
        (l) => l.properties.id === locations[i].properties.id
      ) > -1;

    return {
      id: locations[i].properties.id,
      color: locationColors[i],
      data:
        isPinned && isSuccess
          ? getLineData({
              series: data.series,
              group,
              metric: activeBubble,
              dateRange,
            })
          : [],
      visible: isSuccess,
    };
  });
  return [overallLine, ...locationLines];
}
