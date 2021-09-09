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
  lat,
  lon,
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
    ],
    shallow
  );

  const setViewport = useMapStore((state) => state.setViewport);

  // // update active bubble on changes
  // useEffect(() => {
  //   setActiveBubble(activeBubble);
  // }, [activeBubble, setActiveBubble]);

  // // update active choropleth on changes
  // useEffect(() => {
  //   setActiveChoropleth(activeChoropleth);
  // }, [activeChoropleth, setActiveChoropleth]);

  // // update active region on changes
  // useEffect(() => {
  //   setActiveRegion(activeRegion);
  // }, [activeRegion, setActiveRegion]);

  // // update active date range on changes
  // useEffect(() => {
  //   setActiveDateRange(activeDateRange);
  // }, [activeDateRange, setActiveDateRange]);

  // //update available metrics on changes
  // useEffect(() => {
  //   setMetrics(metrics);
  // }, [metrics, setMetrics]);

  // //update available regions on changes
  // useEffect(() => {
  //   setRegions(regions);
  // }, [regions, setRegions]);

  // // update date range on changes
  // useEffect(() => {
  //   setDateRange(dateRange);
  // }, [dateRange, setDateRange]);

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
      lat,
      lon,
      precinct,
    });
    setViewport({
      zoom,
      latitude: lat,
      longitude: lon,
    });
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
