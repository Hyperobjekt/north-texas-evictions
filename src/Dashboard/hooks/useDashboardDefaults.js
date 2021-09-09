import { useMapStore } from "@hyperobjekt/mapbox";
import { useEffect } from "react";
import shallow from "zustand/shallow";
import useDashboardStore from "./useDashboardStore";

/**
 * Populates the dashboard store with initial values.
 */
export default function useDashboardDefaults({
  activeBubble,
  activeChoropleth,
  activeRegion,
  activeDateRange,
  regions,
  metrics,
  dateRange,
  zoom,
  latitude,
  longitude,
  defaultViewport,
  precinct,
}) {
  // pull app state setters from store
  const [
    setMetrics,
    setRegions,
    setActiveBubble,
    setActiveChoropleth,
    setActiveRegion,
    setDateRange,
    setActiveDateRange,
    setFilters,
    setReady,
    setDefaultViewport,
  ] = useDashboardStore(
    (state) => [
      state.setMetrics,
      state.setRegions,
      state.setActiveBubble,
      state.setActiveChoropleth,
      state.setActiveRegion,
      state.setDateRange,
      state.setActiveDateRange,
      state.setFilters,
      state.setReady,
      state.setDefaultViewport,
    ],
    shallow
  );

  const setViewport = useMapStore((state) => state.setViewport);

  // set ready to true when all defaults are set
  useEffect(() => {
    console.debug("setting defaults:", {
      activeBubble,
      activeChoropleth,
      activeRegion,
      activeDateRange,
      regions,
      metrics,
      dateRange,
      zoom,
      latitude,
      longitude,
      precinct,
    });
    setViewport({
      zoom,
      latitude,
      longitude,
    });
    setViewport({ zoom, latitude, longitude }); // update the map store viewport (changes)
    setDefaultViewport(defaultViewport); // update the dashboard store so we can retrieve this later (does not change)
    setActiveBubble(activeBubble);
    setActiveChoropleth(activeChoropleth);
    setActiveRegion(activeRegion);
    setActiveDateRange(activeDateRange);
    setMetrics(metrics);
    setRegions(regions);
    setDateRange(dateRange);
    precinct && setFilters([["precinct", precinct]]);
    setTimeout(() => setReady(true), 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
