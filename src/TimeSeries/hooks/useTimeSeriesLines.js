import { useEffect } from "react";
import { groupByMonth, groupByWeek, movingAverage } from "..";
import { parseDate, useDashboardStore } from "../../Dashboard";
import { ALL_DATA_COLOR } from "../../Dashboard/constants";
import useSummaryData from "../../Data/useSummaryData";
import { useLocationStore } from "../../Locations";
import useLocationColors from "../../Locations/hooks/useLocationColors";
import useLocationSeries from "../../Locations/hooks/useLocationSeries";
import {
  getFeatureProp,
  getSubLocationColor,
  getSubLocations,
} from "../../Locations/utils";
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
 * Returns any active sublocations in a mock-GeoJSON format, so the result
 * can be passed to useLocationSeries.
 * @param {*} locations
 * @param {*} subLocations
 * @returns
 */
const getSubLocationFeatures = (locations, subLocations) => {
  return locations.reduce((result, parent, index) => {
    const id = getFeatureProp(parent, "id");
    const subs = getSubLocations(id, subLocations);
    if (!subs) return result;
    subs.forEach((sub, i) => {
      sub.pinned &&
        result.push({
          id: sub.id,
          source: "subprecints",
          properties: {
            id: sub.id,
            name: sub.name,
            rhh: getFeatureProp(parent, "rhh"),
            locationIndex: index,
            subLocationIndex: i,
            numSubLocations: subs.length,
          },
        });
    });
    return result;
  }, []);
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
  const subLocations = useLocationStore((state) => state.subLocations);
  const locationColors = useLocationColors(locations);
  const locationSeries = useLocationSeries(locations, dateRange);
  const numLocations = pinnedLocations.length;
  const subLocationFeatures = getSubLocationFeatures(locations, subLocations);
  const subLocationSeries = useLocationSeries(subLocationFeatures, dateRange);
  const numSubLocations = subLocationFeatures.length;

  // ensure that the "overall" data is on if there are no pinned locatons
  useEffect(() => {
    if (numLocations === 0 && numSubLocations === 0 && !showOverall)
      setShowOverall(true);
  }, [numLocations, numSubLocations, showOverall, setShowOverall]);

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
  const locationLines = locationSeries
    .map(({ data, isSuccess }, i) => {
      const isPinned =
        pinnedLocations.findIndex((l) => {
          return l?.properties?.id === locations[i]?.properties?.id;
        }) > -1;
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
    })
    .filter(Boolean);

  // lines for sub-precincts
  const subLocationLines = subLocationSeries.map(({ data, isSuccess }, i) => {
    const feature = subLocationFeatures[i];
    const id = getFeatureProp(feature, "id");
    const subLocationIndex = getFeatureProp(feature, "subLocationIndex");
    const parentLocationIndex = getFeatureProp(feature, "locationIndex");
    const parentColor = locationColors[parentLocationIndex];
    const numSubLocations = getFeatureProp(feature, "numSubLocations");
    const color = getSubLocationColor(
      parentColor,
      subLocationIndex,
      numSubLocations
    );
    return {
      id,
      color,
      dashArray: "8 3",
      data: isSuccess
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
  return [overallLine, ...locationLines, ...subLocationLines];
}
