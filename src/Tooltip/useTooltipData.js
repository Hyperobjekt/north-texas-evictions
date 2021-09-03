import { useMapStore } from "@hyperobjekt/mapbox";
import useBubblesData from "../Data/useBubblesData";

/**
 * Returns the data corresponding to the hovered location
 */
export default function useTooltipData() {
  const hoveredFeature = useMapStore((state) => state.hoveredFeature);
  const selectedFeature = useMapStore((state) => state.selectedFeature);
  const currentFeature = hoveredFeature || selectedFeature;
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
