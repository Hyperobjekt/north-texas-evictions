import useBubblesData from "./useBubblesData";
import useChoroplethData from "./useChoroplethData";

/**
 * Returns an object that indicates the loading status of the current data
 * @returns { isReady: boolean, bubble: string, choropleth: string }
 */
export default function useDataStatus() {
  const bubble = useBubblesData();
  const choropleth = useChoroplethData();
  return {
    isReady: bubble.status === "success" && choropleth.status === "success",
    bubble: bubble.status,
    choropleth: choropleth.status,
  };
}
