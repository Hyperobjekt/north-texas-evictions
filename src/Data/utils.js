import { quantile } from "d3-array";

/**
 * adds integer ids to each feature (for mapbox state)
 */
export const addFeatureIds = (geojson) => {
  return {
    ...geojson,
    features: geojson.features.map((feature, i) =>
      feature.id
        ? feature
        : {
            id: feature.properties.id ? Number(feature.properties.id) : i + 1,
            ...feature,
          }
    ),
  };
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
    extents[keys[i]] = [
      quantile(features, minQuantile, (f) => f.properties[keys[i]]), // min value
      quantile(features, maxQuantile, (f) => f.properties[keys[i]]), // max value
      features.map((f) => f.properties[keys[i]]).filter(Boolean), // all values
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
