import useBubblesData from "./useBubblesData";
import useChoroplethData from "./useChoroplethData";

/**
 * Returns an object with the extents of all available data properties
 */
export default function useDataExtents() {
  const bubble = useBubblesData();
  const choropleth = useChoroplethData();
  const collection = [bubble, choropleth];
  return collection
    .filter((entry) => entry.status === "success")
    .reduce((extents, entry) => {
      return {
        ...extents,
        ...entry.data.extents,
      };
    }, {});
}
