import { useFlyToBounds } from "@hyperobjekt/mapbox";
import bbox from "@turf/bbox";
import { useRef, useEffect } from "react";
import { useDashboardStore } from "../../Dashboard";
import useChoroplethData from "../../Data/useChoroplethData";
import { parseRoute } from "../../HashRouter";

export default function useFlyOnLoad() {
  // zoom to region bounds if no viewport set in the URL
  const hasZoomed = useRef(false);
  const flyToBounds = useFlyToBounds();
  const defaultViewport = useDashboardStore((state) => state.defaultViewport);
  const { status, data } = useChoroplethData();
  useEffect(() => {
    if (status !== "success" || hasZoomed.current) return;
    hasZoomed.current = true;
    const bounds = data.bounds || bbox(data.geojson);
    const { zoom, latitude, longitude } = parseRoute(
      undefined,
      window.location.hash
    );
    // fly to bounds if map has loaded with default viewport
    const shouldFlyToBounds =
      !zoom ||
      !latitude ||
      !longitude ||
      (zoom === defaultViewport.zoom &&
        latitude === defaultViewport.latitude &&
        longitude === defaultViewport.longitude);
    try {
      shouldFlyToBounds &&
        flyToBounds([
          [bounds[0], bounds[1]],
          [bounds[2], bounds[3]],
        ]);
    } catch (e) {
      console.error(e);
    }
  }, [data, status, defaultViewport, flyToBounds]);
}
