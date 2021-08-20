import { useQuery } from "react-query";
import useDashboardRegion from "../Dashboard/hooks/useDashboardRegion";
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
      return {
        extents: extractExtentsFromGeojson(json),
        geojson: addFeatureIds(json),
      };
    });
};

/**
 * Returns a [query object](https://react-query.tanstack.com/guides/queries#query-basics)
 * containing choropleth data and fetch status
 * @returns { data: { geojson: object, extents: object }, status: string }
 */
export default function useChoroplethData() {
  const activeRegion = useDashboardRegion();
  const geojsonUrl = activeRegion && activeRegion["choropleth"];
  const region = activeRegion && activeRegion.id;
  return useQuery(["choropleth", region], () =>
    fetchChoroplethData(geojsonUrl)
  );
}
