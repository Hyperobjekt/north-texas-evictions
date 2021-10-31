/**
 * Returns a region from a location ID
 * @param {*} id
 * @returns
 */
export const getRegionFromId = (id) => {
  switch (id.length) {
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
    default:
      throw new Error(`No region for ID: ${id}`);
  }
};
