import { useMapStore } from "@hyperobjekt/mapbox";
import { useBubblesData } from "../Data";

/**
 * Returns the data corresponding to the hovered location
 */
export default function useTooltipData() {
  const hoveredFeature = useMapStore((state) => state.hoveredFeature);
  const currentFeature = hoveredFeature;
  const { data } = useBubblesData();
  const bubbleFeature =
    data?.geojson?.features?.find(
      (f) => f.properties?.id === currentFeature?.properties?.id
    ) || {};
  const tooltipData =
    currentFeature && bubbleFeature
      ? { ...currentFeature.properties, ...bubbleFeature.properties }
      : currentFeature;
  return tooltipData;
}
