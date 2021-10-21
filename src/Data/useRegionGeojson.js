import { useQuery } from "react-query";
import { useDashboardStore } from "../Dashboard";

/**
 * Fetches bubble GeoJSON and returns and object
 * containing the geojson and a data object containing
 * the extent of each property along with values
 */
export const fetchGeojson = (url) => {
  if (!url) return Promise.reject("no url provided for choropleth geojson");
  return fetch(url).then((response) => response.json());
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
