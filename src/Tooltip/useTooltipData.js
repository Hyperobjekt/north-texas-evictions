import { useMapStore } from "@hyperobjekt/mapbox";
import useBubblesData from "../Data/useBubblesData";

/**
 * Returns the data corresponding to the hovered location
 */
export default function useTooltipData() {
  const hoveredFeature = useMapStore((state) => state.hoveredFeature);
  const { data } = useBubblesData();
  const bubbleFeature = data?.geojson?.features?.find(
    (f) => f.properties?.id === hoveredFeature?.properties?.id
  );
  const tooltipData =
    hoveredFeature && bubbleFeature
      ? { ...hoveredFeature.properties, ...bubbleFeature.properties }
      : hoveredFeature;
  return tooltipData;
}
