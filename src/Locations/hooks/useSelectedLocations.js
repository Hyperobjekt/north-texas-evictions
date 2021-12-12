import { useMapStore } from "@hyperobjekt/mapbox";
import { useEffect } from "react";
import useLocationStore from "./useLocationStore";

export default function useSelectedLocations() {
  const selected = useMapStore((state) => state.selectedFeature);
  const addLocation = useLocationStore((state) => state.addLocation);
  const setShowLocations = useLocationStore((state) => state.setShowLocations);
  const setActive = useLocationStore((state) => state.setActive);
  const addPinned = useLocationStore((state) => state.addPinned);
  useEffect(() => {
    if (selected) {
      addLocation(selected);
      setActive(selected);
      addPinned(selected);
      setShowLocations(true);
    }
  }, [selected, setShowLocations, addLocation, addPinned, setActive]);
}
