import { useFlyToBounds } from "@hyperobjekt/mapbox";
import bbox from "@turf/bbox";
import { useCallback } from "react";
import useChoroplethData from "../../Data/useChoroplethData";

export default function useFlyToFitBounds() {
  const { data } = useChoroplethData();
  const flyToBounds = useFlyToBounds();
  return useCallback(() => {
    if (!data?.geojson) return;
    const bounds = bbox(data.geojson);
    console.log({ bounds });
    const flyBounds = [
      [bounds[0], bounds[1]],
      [bounds[2], bounds[3]],
    ];
    flyToBounds(flyBounds);
  }, [data, flyToBounds]);
}
