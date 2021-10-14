import { useMemo } from "react";
import { useLocationStore } from "..";
import useLocationColors from "./useLocationColors";

/**
 * Returns a mapboxgl style object for choropleth layers
 */
const getPinnedLayerStyle = (pinnedLocations, colors) => {
  if (!pinnedLocations?.length) {
    return [];
  }
  const colorPairs = pinnedLocations
    .map((location, i) => [location.properties.id, colors[i]])
    .flat();
  return [
    {
      id: `pinned-outlines2`,
      source: `pinned-locations`,
      type: "line",
      paint: {
        "line-color": "#fff",
        "line-width": 7,
        "line-opacity": 1,
      },
      beforeId: "road-label-simple",
    },
    {
      id: `pinned-outlines`,
      source: `pinned-locations`,
      type: "line",
      paint: {
        "line-color": ["match", ["get", "id"], ...colorPairs, "#f00"],
        "line-width": 3,
        "line-opacity": 1,
      },
      beforeId: "road-label-simple",
    },
  ];
};

export default function usePinnedLayers() {
  const pinned = useLocationStore((state) => state.pinned);
  const colors = useLocationColors(pinned);
  return useMemo(() => {
    return getPinnedLayerStyle(pinned, colors);
  }, [pinned, colors]);
}
