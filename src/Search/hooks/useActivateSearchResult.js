import { useFlyToLatLon } from "@hyperobjekt/mapbox";
import { useCallback, useRef } from "react";
import { useDashboardRegion } from "../../Dashboard";
import { useLocationStore } from "../../Locations";

// maps region to zoom levels when flying to a location
const ZOOM_LEVELS = {
  tracts: 15,
  cities: 12,
  zips: 12,
  counties: 9,
  districts: 14,
  attendanceel: 14,
  attendancemi: 14,
  attendancehi: 14,
  courts: 14,
};

/**
 * Returns a function that activates a search result.
 * - Adds the location to the location legend
 * - Adds pinned status to the location
 * - Centers the viewport on the location
 * @returns
 */
export default function useActivateSearchResult() {
  const activated = useRef(false);
  const addToLoadQueue = useLocationStore((state) => state.addToLoadQueue);
  const flyToLatLon = useFlyToLatLon();
  const [activeRegion, setActiveRegion] = useDashboardRegion();

  return useCallback(
    (result) => {
      if (!result || !result.point || !result.region || !result.feature) return;
      activated.current = false;
      result.region !== activeRegion && setActiveRegion(result.region);

      flyToLatLon(
        result.point[1],
        result.point[0],
        ZOOM_LEVELS[result.region] || 10
      );
      addToLoadQueue([result.feature.properties.id]);
    },
    [flyToLatLon, activeRegion, setActiveRegion, addToLoadQueue]
  );
}
