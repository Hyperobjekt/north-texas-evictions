import { useEffect } from "react";
import useDashboardStore from "./useDashboardStore";

/**
 * Populates the app store with the values from the options object.
 */
export default function useSetDashboardState({
  activeBubble,
  activeChoropleth,
  activeRegion,
  activeDateRange,
  regions,
  metrics,
  dateRange,
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
  ] = useDashboardStore((state) => [
    state.setMetrics,
    state.setRegions,
    state.setActiveBubble,
    state.setActiveChoropleth,
    state.setActiveRegion,
    state.setDateRange,
    state.setActiveDateRange,
  ]);

  // update active bubble on changes
  useEffect(() => {
    setActiveBubble(activeBubble);
  }, [activeBubble, setActiveBubble]);

  // update active choropleth on changes
  useEffect(() => {
    setActiveChoropleth(activeChoropleth);
  }, [activeChoropleth, setActiveChoropleth]);

  // update active region on changes
  useEffect(() => {
    setActiveRegion(activeRegion);
  }, [activeRegion, setActiveRegion]);

  // update active date range on changes
  useEffect(() => {
    setActiveDateRange(activeDateRange);
  }, [activeDateRange, setActiveDateRange]);

  //update available metrics on changes
  useEffect(() => {
    setMetrics(metrics);
  }, [metrics, setMetrics]);

  //update available regions on changes
  useEffect(() => {
    setRegions(regions);
  }, [regions, setRegions]);

  // update date range on changes
  useEffect(() => {
    setDateRange(dateRange);
  }, [dateRange, setDateRange]);
}
