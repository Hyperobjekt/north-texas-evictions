import { useQueries } from "react-query";
import { EVICTION_DATA_ENDPOINT } from "../../Dashboard/constants";
import { getDailyAverage } from "../../TimeSeries/utils";

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
  return fetch(`${EVICTION_DATA_ENDPOINT}/summary?${paramString}`)
    .then((response) => response.json())
    .then((summary) => {
      return fetch(`${EVICTION_DATA_ENDPOINT}/filings?${paramString}`)
        .then((response) => response.json())
        .then((series) => {
          const match = summary.result.find((r) => r.id === locationId);
          const result = {
            id: series.location,
            ef: match?.ef,
            tfa: match?.tfa,
            mfa: match?.mfa,
            series: series.result,
            avg7: getDailyAverage(series.result, 7),
            avg30: getDailyAverage(series.result, 30),
            past7: getDailyAverage(series.result, 7, 7),
            past30: getDailyAverage(series.result, 30, 30),
          };
          // add diff values if available
          result["diff7"] =
            Number.isFinite(result.avg7) &&
            Number.isFinite(result.past7) &&
            Math.round(result.avg7 - result.past7);
          result["diff30"] =
            Number.isFinite(result.avg30) &&
            Number.isFinite(result.past30) &&
            Math.round(result.avg30 - result.past30);
          return result;
        });
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
