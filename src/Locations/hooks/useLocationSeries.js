import { useQueries } from "react-query";
import { EVICTION_DATA_ENDPOINT } from "../../Dashboard/constants";
import { fillSeries } from "../../Data/utils";
import { getDailyAverage } from "../../TimeSeries/utils";
import { getNameParts } from "../components/LocationName";
import { getRegionFromId } from "../utils";

/**
 * Fetches the data series for a single location
 * @param {string} locationId The location id to fetch data for
 * @param {array} dateRange [startDate, endDate] in ISO8601 format
 */
const fetchLocationSeries = (locationId, dateRange, region, feature) => {
  const [start, end] = dateRange;
  // ensure required dates are set and in proper format
  if (!start || !end) {
    return Promise.reject(`start and end dates are required`);
  }
  const params = { start, end, location: locationId, region };
  const paramString = new URLSearchParams(params).toString();
  const renterHouseholds = getFeatureProp(feature, "rhh");
  const name = getFeatureProp(feature, "name");
  return fetch(`${EVICTION_DATA_ENDPOINT}/summary?${paramString}`)
    .then((response) => response.json())
    .then((summary) => {
      return fetch(`${EVICTION_DATA_ENDPOINT}/filings?${paramString}`)
        .then((response) => response.json())
        .then((series) => {
          const filledSeries = fillSeries(series.result, start, end);
          // summary does not return specific location,
          // so pull individual location from results
          const locationSummary = summary.result.find(
            (entry) => entry.id === locationId
          );
          const totalFilings = locationSummary?.ef;
          const result = {
            id: series.location,
            rhh: renterHouseholds,
            ef: totalFilings,
            tfa: locationSummary?.tfa,
            mfa: locationSummary?.mfa,
            efr: renterHouseholds
              ? 1000 * (totalFilings / renterHouseholds)
              : null,
            // add filings per 1000 renters to time series
            series: filledSeries.map((d) => ({
              ...d,
              name: getNameParts(name)[0],
              efr:
                renterHouseholds && d.ef
                  ? 1000 * (d.ef / renterHouseholds)
                  : null,
            })),
            avg7: getDailyAverage("ef", filledSeries, 7),
            avg30: getDailyAverage("ef", filledSeries, 30),
            past7: getDailyAverage("ef", filledSeries, 7, 7),
            past30: getDailyAverage("ef", filledSeries, 30, 30),
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

/**
 * Returns a property from a feature if it exists
 */
const getFeatureProp = (feature, prop = "id") => feature?.properties?.[prop];

const getRegionFromFeature = (feature) => {
  const source = feature?.source || feature?.layer?.source;
  if (!source) return getRegionFromId(getFeatureProp(feature, "id"));
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
    features?.map((feature) => {
      const id = getFeatureProp(feature, "id");
      const region = getRegionFromFeature(feature);
      return {
        queryKey: [id, ...dateRange],
        queryFn: () => fetchLocationSeries(id, dateRange, region, feature),
      };
    })
  );
}
