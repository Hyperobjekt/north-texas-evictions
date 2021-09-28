import { useMemo } from "react";

/**
 * Returns a mapboxgl style object for choropleth layers
 */
const getPinnedLayerStyle = () => {
  return {
    id: `pinned-outlines`,
    source: `pinned-locations`,
    type: "line",
    paint: {
      "line-color": "#f00",
      "line-width": 3,
      "line-opacity": 1,
    },
    beforeId: "road-label-simple",
  };
};

export default function usePinnedLayer() {
  // const pinned = useLocationStore((state) => state.pinned);
  return useMemo(() => {
    return getPinnedLayerStyle();
  }, []);
}
