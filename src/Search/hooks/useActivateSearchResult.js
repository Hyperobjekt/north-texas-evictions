import { useFlyToLatLon } from "@hyperobjekt/mapbox";
import { useCallback } from "react";
import { useDashboardRegion } from "../../Dashboard";
import { useLocationStore } from "../../Locations";

// maps region to zoom levels when flying to a location
const ZOOM_LEVELS = {
  tracts: 15,
  cities: 12,
  zips: 12,
  counties: 9,
  districts: 14,
};

export default function useActivateSearchResult() {
  const addLocation = useLocationStore((state) => state.addLocation);
  const setActive = useLocationStore((state) => state.setActive);
  const addPinned = useLocationStore((state) => state.addPinned);
  const flyToLatLon = useFlyToLatLon();
  const [activeRegion, setActiveRegion] = useDashboardRegion();

  return useCallback(
    (result) => {
      console.log({ search: result });
      if (!result || !result.point || !result.region || !result.feature) return;
      result.region !== activeRegion && setActiveRegion(result.region);
      // add source so that `useLocationSeries` can fetch data
      result.feature.source = result.region + "-search";
      flyToLatLon(
        result.point[1],
        result.point[0],
        ZOOM_LEVELS[result.region] || 10
      );
      // TODO: fetch demographic geojson feature and merge in props
      addLocation(result.feature);
      setActive(result.feature);
      addPinned(result.feature);
    },
    [
      addLocation,
      setActive,
      addPinned,
      flyToLatLon,
      activeRegion,
      setActiveRegion,
    ]
  );
}
