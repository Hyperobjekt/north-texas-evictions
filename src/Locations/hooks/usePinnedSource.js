import { useMemo } from "react";
import useLocationStore from "./useLocationStore";

export default function usePinnedSource() {
  const pinned = useLocationStore((state) => state.pinned);
  return useMemo(() => {
    return {
      id: `pinned-locations`,
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: pinned,
      },
    };
  }, [pinned]);
}
