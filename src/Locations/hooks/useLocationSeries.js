import { useQueries } from "react-query";
import { EVICTION_DATA_ENDPOINT } from "../../Dashboard/constants";

/**
 * Fetches the data series for a single location
 * @param {string} locationId The location id to fetch data for
 * @param {array} dateRange [startDate, endDate] in ISO8601 format
 */
const fetchLocationSeries = (locationId, dateRange, region) => {
  const [start, end] = dateRange;
  // ensure required dates are set and in proper format
  if (!start || !end) {
    return Promise.reject(`start and end dates are required`);
  }
  const params = { start, end, location: locationId, region };
  const paramString = new URLSearchParams(params).toString();
  return fetch(`${EVICTION_DATA_ENDPOINT}/filings?${paramString}`)
    .then((response) => response.json())
    .then((series) => {
      return {
        id: series.location,
        series: series.result,
      };
    });
};

const getLocationIdFromFeature = (feature) => feature.properties.id;

const getRegionFromFeature = (feature) => {
  const source = feature?.source || feature?.layer?.source;
  if (!source) throw new Error("No source found for feature");
  return source.split("-")[0];
};

/**
 * Fetches eviction metrics by day for a given location string and date range
 * @param {*} locationIds array of id strings
 * @param {*} dateRange array containing [ startDate, endDate ] in ISO 8601 format
 * @returns
 */
export default function useLocationSeries(features = [], dateRange) {
  return useQueries(
    features.map((feature) => {
      const id = getLocationIdFromFeature(feature);
      const region = getRegionFromFeature(feature);
      return {
        queryKey: [id, ...dateRange],
        queryFn: () => fetchLocationSeries(id, dateRange, region),
      };
    })
  );
}
