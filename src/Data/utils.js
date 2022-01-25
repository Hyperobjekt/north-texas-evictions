import { quantile } from "d3-array";
import { timeDay } from "d3-time";
import { parseDate } from "../Dashboard";
import { getDailyAverage } from "../TimeSeries/utils";

/**
 * Fills entries in the series with 0 for dates with no value
 * @param {*} series
 * @param {*} start
 * @param {*} end
 */
export const fillSeries = (series, start, end) => {
  // array of all days between start and end, starting with the most recent
  const allDays = timeDay.range(parseDate(start), parseDate(end)).reverse();
  const result = [];
  allDays.forEach((day) => {
    const date = day.toISOString().slice(0, 10);
    const entry = series.find((entry) => entry.date === date);
    if (entry) {
      result.push(entry);
    } else {
      result.push({ date, ef: 0, mfa: 0, tfa: 0 });
    }
  });
  return result;
};

/**
 * adds integer ids to each feature (for mapbox state)
 */
export const addFeatureIds = (geojson) => {
  return {
    ...geojson,
    features: geojson.features.map((feature, i) => {
      // feature ID should only contain numbers
      const newFeatureId = feature.properties.id
        ? feature.properties.id.replace(/\D/g, "")
        : i + 1;
      return {
        ...feature,
        id: Number(newFeatureId),
        properties: {
          ...feature.properties,
          id: newFeatureId,
        },
      };
    }),
  };
};

/**
 * Filters outliers from the geojson features.
 * - currently only used to filter out low values of renter occupied households
 */
export const getFilteredFeaturesForExtent = (features, metric) => {
  if (metric !== "efr") return features;
  // for eviction filing rate, do not include places with low renter households for extents
  return features.filter((feature) => {
    return feature.properties["rhh"] > 50;
  });
};

/**
 * Pulls min/max for all feature properties from the GeoJSON collection.
 * Can specify an optional min / max quantile in options to reduce outliers.
 */
export const extractExtentsFromGeojson = (geojson, options = {}) => {
  const { minQuantile = 0, maxQuantile = 1 } = options;
  const { features } = geojson;
  // grab superset of all feature properties (keys)
  const keys = Object.keys(
    features.reduce(
      (collection, feature) => ({ ...collection, ...feature.properties }),
      {}
    )
  );
  const extents = {};
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const extentFeatures = getFilteredFeaturesForExtent(features, key);
    extents[key] = [
      quantile(extentFeatures, minQuantile, (f) => f.properties[key]), // min value
      quantile(extentFeatures, maxQuantile, (f) => f.properties[key]), // max value
      features.map((f) => f.properties[key]).filter(Boolean), // all values
    ];
  }
  return extents;
};

/**
 * Adds the provided data to the geojson features (when ids match)
 */
export const addDataToGeojson = (geojson, data, matchProp = "id") => {
  if (!data) return geojson;
  return {
    ...geojson,
    features: geojson.features.map((feature) => {
      const dataEntry = data.find(
        (d) => d[matchProp] === feature.properties[matchProp]
      );
      if (!dataEntry) return feature;
      const newFeature = {
        ...feature,
        properties: { ...feature.properties, ...dataEntry },
      };
      return newFeature;
    }),
  };
};

/**
 * Adds a scale min / max to the scale options if minQuantile / maxQuantile are provided
 * @param {Array<Number>} data
 * @param {object} { minQuantile, maxQuantile, ...ScaleOptions }
 * @returns {ScaleOptions} { ScaleOptions }
 */
export const getAdjustedScaleOptions = (
  data,
  { minQuantile, maxQuantile, ...options }
) => {
  if (!minQuantile && !maxQuantile) return options;
  if (data && minQuantile) options.min = quantile(data, minQuantile);
  if (data && maxQuantile) options.max = quantile(data, maxQuantile);
  return options;
};

/**
 * Returns an object containing averages for last 7 days, last 30 days, and
 * also the difference between the previous 7 / 30 days.
 * @param {*} series
 * @returns { avg7, avg30, past7, past30, diff7, diff30 }
 */
export const getAvgDiffs = (series) => {
  const result = {
    avg7: getDailyAverage("ef", series, 7),
    avg30: getDailyAverage("ef", series, 30),
    past7: getDailyAverage("ef", series, 7, 7),
    past30: getDailyAverage("ef", series, 30, 30),
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
};
