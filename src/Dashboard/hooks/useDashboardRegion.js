import shallow from "zustand/shallow";
import useDashboardStore from "./useDashboardStore";

/**
 * Provides the active region along with GeoJSON data
 */
export default function useDashboardRegion() {
  const [activeRegionId, regions] = useDashboardStore(
    (state) => [state.activeRegion, state.regions],
    shallow
  );
  // get the active region object
  return regions.find((region) => region.id === activeRegionId);
}
