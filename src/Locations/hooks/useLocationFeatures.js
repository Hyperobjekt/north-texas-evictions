import { useRegionsGeojson } from "../../Data/useRegionGeojson";
import { getRegionFromId } from "../utils";

export default function useLocationFeatures(locationIds) {
  const regionIds = locationIds.map(getRegionFromId).reduce((all, current) => {
    if (all.indexOf(current) === -1) all.push(current);
    return all;
  }, []);
  const regionsGeojson = useRegionsGeojson(regionIds, "choropleth");
}
