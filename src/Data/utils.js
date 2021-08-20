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
 * Pulls min/max for all feature properties from the GeoJSON collection
 */
export const extractExtentsFromGeojson = (geojson) => {
  const { features } = geojson;
  return features.reduce((data, feature) => {
    if (!feature.properties) return data;
    Object.entries(feature.properties).forEach(([key, value]) => {
      if (!value) return;
      if (!data[key])
        data[key] = [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER, []];
      data[key][0] = Math.min(data[key][0], value);
      data[key][1] = Math.max(data[key][1], value);
      data[key][2].push(value);
    });
    return data;
  }, {});
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
