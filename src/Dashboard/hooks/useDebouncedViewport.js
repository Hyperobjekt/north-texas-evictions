import { useMapViewport } from "@hyperobjekt/mapbox";
import { useDebounce } from "@hyperobjekt/hooks";
import { useMemo } from "react";

const round = (value, decimals = 3) => {
  return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
};

/**
 * Returns a debounced viewport for route updates
 * @returns
 */
export default function useDebouncedViewport() {
  const [{ latitude, longitude, zoom }] = useMapViewport();
  const debouncedLatitude = useDebounce(round(latitude), 100);
  const debouncedLongitude = useDebounce(round(longitude), 100);
  const debouncedZoom = useDebounce(round(zoom), 100);
  return useMemo(() => {
    return {
      latitude: debouncedLatitude,
      longitude: debouncedLongitude,
      zoom: debouncedZoom,
    };
  }, [debouncedLatitude, debouncedLongitude, debouncedZoom]);
}
