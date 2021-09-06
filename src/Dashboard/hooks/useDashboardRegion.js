import shallow from "zustand/shallow";
import { useLang } from "../../Language";
import useDashboardStore from "./useDashboardStore";

/**
 * Provides the active region along with GeoJSON data
 */
export default function useDashboardRegion() {
  const [activeRegion, setActiveRegion, regions] = useDashboardStore(
    (state) => [state.activeRegion, state.setActiveRegion, state.regions],
    shallow
  );
  const regionLabels = useLang(
    regions.map((region) => `region_${region.id}`.toUpperCase())
  );
  // get the active region object
  return [
    activeRegion,
    setActiveRegion,
    regions.map((r, i) => ({ ...r, label: regionLabels[i] })),
  ];
}
