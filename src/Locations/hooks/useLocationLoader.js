import { useLocationStore } from "..";
import { useRegionsGeojson } from "../../Data/hooks/useRegionGeojson";
import { getRegionFromId } from "../utils";

export default function useLocationLoader() {
  const loadQueue = useLocationStore((state) => state.loadQueue);
  const removeFromLoadQueue = useLocationStore(
    (state) => state.removeFromLoadQueue
  );
  const addLocations = useLocationStore((state) => state.addLocations);
  const addPinnedLocations = useLocationStore(
    (state) => state.addPinnedLocations
  );
  const regionIds = loadQueue
    .map((l) => getRegionFromId(l.id))
    .reduce((all, current) => {
      if (all.indexOf(current) === -1) all.push(current);
      return all;
    }, []);
  const regionsGeojson = useRegionsGeojson(regionIds, "choropleth");
  if (loadQueue.length === 0) return;
  const matches = [];
  const loadQueueIds = loadQueue.map((l) => l.id);
  for (let i = 0; i < regionsGeojson.length; i++) {
    const regionQuery = regionsGeojson[i];
    if (!regionQuery.isSuccess || !regionQuery.data) continue;
    regionQuery.data.geojson.features.forEach((feature) => {
      if (loadQueueIds.indexOf(feature.properties.id) !== -1) {
        matches.push({
          ...feature,
          source: getRegionFromId(feature.properties.id) + "-choropleth",
        });
      }
    });
  }
  matches.length && addLocations(matches);
  matches.length && addPinnedLocations(matches);
  matches.length &&
    removeFromLoadQueue(matches.map((match) => match.properties.id));
}
