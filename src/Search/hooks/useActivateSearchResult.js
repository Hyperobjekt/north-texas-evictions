import { useFlyToLatLon } from "@hyperobjekt/mapbox";
import { useCallback, useRef } from "react";
import { useDashboardRegion, useDashboardStore } from "../../Dashboard";
import { useLocationStore } from "../../Locations";

// maps region to zoom levels when flying to a location
const ZOOM_LEVELS = {
  tracts: 15,
  cities: 12,
  zips: 12,
  counties: 9,
  districts: 14,
  courts: 14,
};

export default function useActivateSearchResult() {
  const activated = useRef(false);
  const mapInstance = useDashboardStore((state) => state.mapInstance);
  const addLocation = useLocationStore((state) => state.addLocation);
  const setActive = useLocationStore((state) => state.setActive);
  const addPinned = useLocationStore((state) => state.addPinned);
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
      // listen for source updates and query the feature when available
      mapInstance?.on("sourcedata", () => {
        if (
          activated.current ||
          !mapInstance.getSource(`${result.region}-choropleth`) ||
          !mapInstance.isSourceLoaded(`${result.region}-choropleth`)
        )
          return;
        const matchedFeatures = mapInstance.querySourceFeatures(
          `${result.region}-choropleth`,
          {
            filter: ["==", "id", result.feature.properties.id],
          }
        );
        if (matchedFeatures.length) {
          const feature = matchedFeatures[0];
          // add source so that `useLocationSeries` can fetch data
          feature.source = result.region + "-choropleth";
          console.log(feature);
          // TODO: fetch demographic geojson feature and merge in props
          addLocation(feature);
          setActive(feature);
          addPinned(feature);
          activated.current = true;
        }
      });
    },
    [
      addLocation,
      setActive,
      addPinned,
      flyToLatLon,
      activeRegion,
      setActiveRegion,
      mapInstance,
    ]
  );
}
