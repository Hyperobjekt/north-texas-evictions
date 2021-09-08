import { useFlyToBounds } from "@hyperobjekt/mapbox";
import bbox from "@turf/bbox";
import { useCallback } from "react";
import useChoroplethData from "../../Data/useChoroplethData";

/**
 * Returns a callback function that will fly to map to the bounds of the current region
 * @returns {function}
 */
export default function useFlyToFitBounds() {
  const { data } = useChoroplethData();
  const flyToBounds = useFlyToBounds();
  return useCallback(() => {
    if (!data?.geojson) return;
    const bounds = bbox(data.geojson);
    const flyBounds = [
      [bounds[0], bounds[1]],
      [bounds[2], bounds[3]],
    ];
    flyToBounds(flyBounds);
  }, [data, flyToBounds]);
}
