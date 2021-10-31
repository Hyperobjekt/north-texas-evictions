import { useCallback } from "react";
import { useDashboardStore } from "../../Dashboard";
import { getRegionFromId } from "../utils";

/**
 * Returns a function that can query map sources for features.
 */
export default function useQuerySourceFeature() {
  const mapInstance = useDashboardStore((state) => state.mapInstance);

  return useCallback(
    (id) => {
      return new Promise((resolve, reject) => {
        const region = getRegionFromId(id);
        if (
          !mapInstance?.getSource(`${region}-choropleth`) ||
          !mapInstance?.isSourceLoaded(`${region}-choropleth`)
        )
          return reject("source not available");
        const matchedFeatures = mapInstance.querySourceFeatures(
          `${region}-choropleth`,
          {
            filter: ["==", "id", id],
          }
        );
        if (!matchedFeatures.length) return reject("no feature found");
        const feature = matchedFeatures[0];
        // add source so that `useLocationSeries` can fetch data
        // feature.source = region + "-choropleth";
        return resolve(feature);
      });
    },
    [mapInstance]
  );
}
