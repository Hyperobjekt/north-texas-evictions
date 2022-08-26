import { lighten } from "@material-ui/core";

/**
 * Returns a region from a location ID
 * @param {*} id
 * @returns
 */
export const getRegionFromId = (id) => {
  switch (id.length) {
    case 4:
      const region = {
        1: "attendanceel",
        2: "attendancemi",
        3: "attendancehi",
      }[id[0]];

      if (region) return region;
    case 5:
      return id.substring(0, 2) === "48" ? "counties" : "zips";
    case 6:
      return "courts";
    case 7:
      return "cities";
    case 9:
      return "districts";
    case 11:
      return "tracts";
  }
  throw new Error(`No region for ID: ${id}`);
};

/**
 * Returns a property from a feature if it exists
 */
export const getFeatureProp = (feature, prop = "id") =>
  feature?.properties?.[prop];

/**
 * Returns the region for the given feature
 */
export const getRegionFromFeature = (feature) => {
  const source = feature?.source || feature?.layer?.source;
  if (!source) return getRegionFromId(getFeatureProp(feature, "id"));
  return source.split("-")[0];
};

/**
 * Pulls an array of sublocations for the provided location ID and subLocations config
 * @param {string} id
 * @param {Array<SubLocations>} subLocations
 * @returns {Array<SubLocation>}
 */
export const getSubLocations = (id, subLocations) => {
  return subLocations.find((sub) => sub.id === id)?.children;
};

/**
 * Returns a lightened version of the location color based on the sublocation index
 * @param {*} locationColor
 * @param {*} subLocationIndex
 * @param {*} numSubLocations
 * @returns {string}
 */
export const getSubLocationColor = (
  locationColor,
  subLocationIndex,
  numSubLocations
) => {
  return lighten(
    locationColor,
    (1 / (numSubLocations + 1)) * (subLocationIndex + 1)
  );
};
