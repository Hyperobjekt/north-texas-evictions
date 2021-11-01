import { useMemo } from "react";
import { useLocationStore } from "..";

// location colors
const COLORS = [
  "#AD77A1",
  "#92C789",
  "#7DB1DD",
  "#F5C04D",
  "#548BC4",
  "#E6612A",
  "#51B167",
  "#873070",
  "#A54947",
  "#1F66AE",
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
