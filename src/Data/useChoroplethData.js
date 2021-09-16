import bbox from "@turf/bbox";
import { useQuery } from "react-query";
import useDashboardRegion from "../Dashboard/hooks/useDashboardRegion";
import useDashboardStore from "../Dashboard/hooks/useDashboardStore";
import { addFeatureIds, extractExtentsFromGeojson } from "./utils";

/**
 * Fetches choropleth GeoJSON and returns and object
 * containing the geojson and a data object containing
 * the extent of each property along with values
 */
const fetchChoroplethData = (url) => {
  if (!url) return Promise.reject("no url provided for choropleth data");
  return fetch(url)
    .then((response) => response.json())
    .then((json) => {
      const geojson = addFeatureIds(json);
      return {
        extents: extractExtentsFromGeojson(json),
        geojson,
        bounds: bbox(geojson),
      };
    });
};

function useRegionGeojson(regionId) {
  const regions = useDashboardStore((state) => state.regions);
  const region = regions.find((r) => r.id === regionId);
  const choroplethLayer = region?.layers?.find((l) => l.id === "choropleth");
  const geojsonUrl = choroplethLayer?.source;
  return useQuery(["choropleth", regionId], () =>
    fetchChoroplethData(geojsonUrl)
  );
}

/**
 * Returns a [query object](https://react-query.tanstack.com/guides/queries#query-basics)
 * containing choropleth data and fetch status
 * @returns { data: { geojson: object, extents: object }, status: string }
 */
export default function useChoroplethData() {
  const [activeRegion] = useDashboardRegion();
  return useRegionGeojson(activeRegion);
}

export function useRegionNames(regionId) {
  const result = useRegionGeojson(regionId);
  return {
    ...result,
    data: result.data?.geojson?.features
      ? result.data.geojson.features.reduce((dict, current) => {
          dict[current.properties.id] = current.properties.name.split(",")[0];
          return dict;
        }, {})
      : result.data,
  };
}
