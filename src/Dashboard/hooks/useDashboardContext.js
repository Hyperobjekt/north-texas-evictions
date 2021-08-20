import shallow from "zustand/shallow";
import useDashboardStore from "./useDashboardStore";

/**
 * Provides the active options for the dashboard.
 */
export default function useDashboardContext() {
  return useDashboardStore(
    ({
      activeRegion,
      activeBubble,
      activeChoropleth,
      activeDateRange,
      filters,
    }) => ({
      activeRegion,
      activeBubble,
      activeChoropleth,
      activeDateRange,
      filters,
    }),
    shallow
  );
}
