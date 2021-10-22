import { useQuery } from "react-query";
import useDashboardStore from "../../Dashboard/hooks/useDashboardStore";

/**
 * Fetches  GeoJSON and returns shaped search data
 */
const fetchGeojson = (region, url) => {
  if (!url) return Promise.reject("no url provided for choropleth geojson");
  return fetch(url)
    .then((response) => response.json())
    .then((geojson) => {
      if (!geojson || !geojson.features) {
        return [];
      }
      return geojson.features
        .map((f) => {
          const name = f.properties.name
            ? f.properties.name.replace(", Texas", "")
            : "Unknown";
          // const [name, ...parent] = nameParts;
          return {
            id: f.properties.id,
            name,
            region,
            // parent: parent && parent.length ? parent.join(",").trim() : parent,
            point: f.geometry.coordinates,
            feature: f,
          };
        })
        .filter((l) => l.name !== "Unknown");
    })
    .catch((err) => {
      console.error(`error loading geojson for ${region}`, err);
      return [];
    });
};

const fetchSearchData = (urls) => {
  return Promise.all(
    urls.map(([region, url]) => fetchGeojson(region, url))
  ).then((results) => results.flat());
};

/**
 * Returns a [query object](https://react-query.tanstack.com/guides/queries#query-basics)
 * containing search data and fetch status
 * @returns { data: { geojson: object, extents: object }, status: string }
 */
export default function useSearchData() {
  const regions = useDashboardStore((state) => state.regions);
  const ids = regions.map((r) => r.id);
  const urls = regions.map((r) => [
    r.id,
    r.layers?.find((l) => l.id === "bubble")?.source,
  ]);
  // update the data on changes
  return useQuery(ids, () => fetchSearchData(urls));
}
