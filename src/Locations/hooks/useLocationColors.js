import { useMemo } from "react";
import { useLocationStore } from "..";

// location colors
const COLORS = [
  "#1f77b4",
  "#ff7f0e",
  "#2ca02c",
  "#d62728",
  "#9467bd",
  "#8c564b",
  "#e377c2",
  "#7f7f7f",
  "#bcbd22",
  "#17becf",
];

/**
 * Returns an array of colors corresponding to the input locationArray.
 */
export default function useLocationColors(locationArray) {
  if (!locationArray)
    throw new Error("No locations provided for useLocationColors");
  if (!Array.isArray(locationArray)) locationArray = [locationArray];
  const locations = useLocationStore((state) => state.locations);
  return useMemo(
    () =>
      locations
        ? locationArray.map((location) => {
            const index = locations.findIndex((l) => l.id === location.id);
            return COLORS[index % COLORS.length];
          })
        : [],
    [locationArray, locations]
  );
}
