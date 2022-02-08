import bbox from "@turf/bbox";
import { useQueries, useQuery } from "react-query";
import { useDashboardStore } from "../../Dashboard";
import { addFeatureIds, extractExtentsFromGeojson } from "../utils";

/**
 * Fetches bubble GeoJSON and returns and object
 * containing the geojson and a data object containing
 * the extent of each property along with values
 */
export const fetchGeojson = (url) => {
  if (!url) return Promise.reject("no url provided for choropleth geojson");
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

/**
 * Returns a [query object](https://react-query.tanstack.com/guides/queries#query-basics)
 * containing geojson data and fetch status
 * @returns { data: { geojson: object, extents: object }, status: string }
 */
export default function useRegionGeojson(regionId, layerType = "bubble") {
  const regions = useDashboardStore((state) => state.regions);
  const region = regions.find((r) => r.id === regionId);
  const layer = region?.layers?.find((l) => l.id === layerType);
  const url = layer?.source;
  return useQuery([regionId, layerType], () => fetchGeojson(url));
}

/**
 * Returns an array of react-query objects containing geojson data and fetch status
 * for the provided regionIds.
 * @returns [{ data: { geojson: object, extents: object }, status: string, isSuccess: boolean }]
 */
export function useRegionsGeojson(regionIds, layerType = "bubble") {
  const regions = useDashboardStore((state) => state.regions);
  const queries = regions
    .filter((r) => regionIds.indexOf(r.id) > -1)
    .map((r) => [r.id, r.layers.find((l) => l.id === layerType)?.source])
    .map(([regionId, url]) => ({
      queryKey: [regionId, layerType],
      queryFn: () => fetchGeojson(url),
    }));
  return useQueries(queries);
}
