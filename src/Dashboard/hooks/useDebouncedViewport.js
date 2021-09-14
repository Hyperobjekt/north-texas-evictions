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
  const [viewport] = useMapViewport();
  const value = [
    round(viewport.latitude),
    round(viewport.longitude),
    round(viewport.zoom),
  ].join(",");
  const debouncedValue = useDebounce(value, 1000);
  return useMemo(() => {
    if (!debouncedValue) return {};
    const [latitude, longitude, zoom] = debouncedValue.split(",");
    return {
      latitude,
      longitude,
      zoom,
    };
  }, [debouncedValue]);
}
