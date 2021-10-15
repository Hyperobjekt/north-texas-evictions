import { useMemo } from "react";
import { useLocationStore } from "..";

// location colors
const COLORS = [
  "#4e79a7",
  "#f28e2c",
  "#e15759",
  "#76b7b2",
  "#59a14f",
  "#edc949",
  "#af7aa1",
  "#ff9da7",
  "#9c755f",
  "#bab0ab",
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
