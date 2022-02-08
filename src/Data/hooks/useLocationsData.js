import { useQuery } from "react-query";
import { EVICTION_DATA_ENDPOINT } from "../../Dashboard/constants";
import { useLocationStore } from "../../Locations";
import { getFeatureProp, getRegionFromFeature } from "../../Locations/utils";
import { fillSeries, getAvgDiffs } from "../utils";
import booleanWithin from "@turf/boolean-within";
import flatten from "@turf/flatten";
import { sum } from "d3-array";
import { useDashboardStore } from "../../Dashboard";

/**
 * Returns true if feat2 is contained within feat1.
 */
const isFeatureWithin = (feat1, feat2) => {
  // convert MultiPolygons to Polygons with `flatten` so we can use `booleanWithin`
  const fc1 = flatten(feat1);
  const fc2 = flatten(feat2);
  return (
    fc1.features
      .map((feature) => {
        // check if all polygons within feat2 are contained within this feat1 polygon
        for (let i = 0; i < fc2.features.length; i++) {
          const feature2 = fc2.features[i];
          if (!booleanWithin(feature, feature2)) return false;
        }
        return true;
      })
      // return true if at least one of the polygons in feat1 contains all of the polygons from feat2
      .some((isWithin) => isWithin)
  );
};

/**
 * Fetches eviction filings data from the API
 */
const fetchLocations = ({ start, end, locations, ...rest }) => {
  if (!start || !end) {
    return Promise.reject(
      "start and end dates are required for location fetch"
    );
  }
  if (!locations || !locations.length) {
    return Promise.reject("no locations provided for location fetch");
  }
  const params = { start, end, ...rest };
  const queryParams = new URLSearchParams(params).toString();
  const filteredLocations = locations.filter((loc1, i) => {
    // check if any of the locations are contained within any of the other locations
    for (let j = 0; j < locations.length; j++) {
      const loc2 = locations[j];
      if (i === j) continue; // skip when loc1 === loc2
      const isWithin = isFeatureWithin(loc1, loc2);
      if (isWithin) return false; // filter out entry if it is within another location
    }
    return true;
  });
  const renterHouseholds = filteredLocations.reduce((sum, loc) => {
    const rhh = getFeatureProp(loc, "rhh");
    return rhh ? sum + rhh : sum;
  }, 0);
  return fetch(`${EVICTION_DATA_ENDPOINT}/locations?${queryParams}`)
    .then((response) => response.json())
    .then((json) => {
      const filledSeries = fillSeries(json.result, start, end); // fill in missing days
      const totalFilings = sum(json.result, (d) => d.ef);
      const totalFilingAmount = sum(json.result, (d) => d.tfa);
      const result = {
        ef: totalFilings,
        efr: 1000 * (totalFilings / renterHouseholds),
        tfa: totalFilingAmount,
        series: filledSeries,
        ...getAvgDiffs(filledSeries),
      };
      return result;
    });
};

/**
 * Provides total amount filed, total number of filings, and time series data
 * for the current time range.
 */
export default function useLocationsData() {
  const activeDateRange = useDashboardStore((state) => state.activeDateRange);
  const locations = useLocationStore((state) => state.locations);
  const locationIds = [];
  // create object of location ids by region (e.g. { zips: ['12345'], counties: ['48113'] })
  const locationsByRegion = locations.reduce((result, feature) => {
    const region = getRegionFromFeature(feature);
    if (!result[region]) result[region] = [];
    const locationId = getFeatureProp(feature, "id");
    result[region].push(locationId);
    locationIds.push(locationId); // track ids for unique query identifier
    return result;
  }, {});
  return useQuery(
    ["locations", ...activeDateRange, ...locationIds.sort()],
    () =>
      fetchLocations({
        locations,
        start: activeDateRange[0],
        end: activeDateRange[1],
        ...locationsByRegion,
      })
  );
}
