import { useQueries } from "react-query";
import { EVICTION_DATA_ENDPOINT } from "../Dashboard/constants";
import useDashboardContext from "../Dashboard/hooks/useDashboardContext";
import useDashboardRegion from "../Dashboard/hooks/useDashboardRegion";
import usePrecinctFilter from "./usePrecinctFilter";
import { fetchGeojson } from "./useRegionGeojson";
import {
  addDataToGeojson,
  addFeatureIds,
  extractExtentsFromGeojson,
} from "./utils";

/**
 * Fetches eviction filings data from the API
 */
const fetchBubbleData = ({ region, start, end, precinct }) => {
  if (!region) return Promise.reject("no region provided for bubble data");
  const params = { region, start, end };
  if (precinct) params.precinct = precinct;
  const paramString = new URLSearchParams(params).toString();
  return fetch(`${EVICTION_DATA_ENDPOINT}/summary?${paramString}`).then(
    (response) => response.json()
  );
};

/**
 * Calculates the eviction filing rate from the feature properties (eviction filings / renter households)
 * @param {*} feature
 * @returns
 */
const getFilingRate = (feature) => {
  if (!feature.properties) return feature;
  const { properties } = feature;
  const { pop, ef, id } = properties;
  // TODO: temporarily filtering out filing rate for specific tract, remove this when it has a more accurate rental households value
  if (id === "48113014002") {
    console.warn("filtering out eviction filing rate for census tract 140.02");
    return null;
  }
  return ef && pop ? (ef / pop) * 1000 : null;
};

/**
 * Adds filings per 1000 renters metric to geojson
 */
const addFilingRatesToGeojson = (geojson) => {
  const features = geojson.features.map((feature) => {
    if (!feature.properties) return feature;
    return {
      ...feature,
      properties: {
        ...feature.properties,
        efr: getFilingRate(feature),
      },
    };
  });
  return {
    ...geojson,
    features,
  };
};

/**
 * Returns a [query object](https://react-query.tanstack.com/guides/queries#query-basics)
 * containing bubble data and fetch status
 * @returns { data: { geojson: object, extents: object }, status: string }
 */
export default function useBubblesData() {
  const {
    activeDateRange: [start, end],
  } = useDashboardContext();
  const [activeRegion, , regions] = useDashboardRegion();
  const [precinct] = usePrecinctFilter();

  const region = regions.find((r) => r.id === activeRegion);
  const bubbleLayer = region?.layers?.find((l) => l.id === "bubble");
  const geojsonUrl = bubbleLayer?.source;

  // fetch the geojson and eviction data
  const [geojsonQuery, evictionQuery] = useQueries([
    {
      queryKey: [activeRegion, "bubble"],
      queryFn: () => fetchGeojson(geojsonUrl),
    },
    {
      queryKey: [],
      queryFn: () =>
        fetchBubbleData({ region: activeRegion, start, end, precinct }),
    },
  ]);
  // if still fetching, return the query in progress
  if (!geojsonQuery.isSuccess) return geojsonQuery;
  if (!evictionQuery.isSuccess) return evictionQuery;

  // add filing rates, root level integer feature ids, and remaining eviction metrics to geojson
  const mergedGeojson = addFilingRatesToGeojson(
    addDataToGeojson(
      addFeatureIds(geojsonQuery.data),
      evictionQuery.data.result
    )
  );
  return {
    status: "success",
    isSuccess: true,
    data: {
      extents: extractExtentsFromGeojson(mergedGeojson),
      geojson: mergedGeojson,
    },
    // provide query objects, just in case they are needed
    _queries: [geojsonQuery, evictionQuery],
  };
}
