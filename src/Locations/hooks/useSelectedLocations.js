import { useMapStore } from "@hyperobjekt/mapbox";
import { useEffect } from "react";
import useLocationStore from "./useLocationStore";

export default function useSelectedLocations() {
  const selected = useMapStore((state) => state.selectedFeature);
  const addLocation = useLocationStore((state) => state.addLocation);
  const setActive = useLocationStore((state) => state.setActive);
  const addPinned = useLocationStore((state) => state.addPinned);
  useEffect(() => {
    if (selected) {
      console.log({ selected });
      addLocation(selected);
      setActive(selected);
      addPinned(selected);
    }
  }, [selected, addLocation, addPinned, setActive]);
}
