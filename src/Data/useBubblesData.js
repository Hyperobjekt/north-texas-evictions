import { useQuery } from "react-query";
import { EVICTION_DATA_ENDPOINT } from "../Dashboard/constants";
import useDashboardContext from "../Dashboard/hooks/useDashboardContext";
import useDashboardRegion from "../Dashboard/hooks/useDashboardRegion";
import {
  addDataToGeojson,
  addFeatureIds,
  extractExtentsFromGeojson,
} from "./utils";

/**
 * Fetches bubble GeoJSON and returns and object
 * containing the geojson and a data object containing
 * the extent of each property along with values
 */
const fetchBubbleGeojson = (url) => {
  if (!url) return Promise.reject("no url provided for choropleth geojson");
  return fetch(url).then((response) => response.json());
};

/**
 * Fetches eviction filings data from the API
 */
const fetchBubbleData = ({ region, start, end }) => {
  if (!region) return Promise.reject("no region provided for bubble data");
  const paramString = new URLSearchParams({ region, start, end }).toString();
  return fetch(`${EVICTION_DATA_ENDPOINT}/summary?${paramString}`).then(
    (response) => response.json()
  );
};

/**
 * Adds filings per 1000 renters metric to geojson
 */
const addFilingRatesToGeojson = (geojson) => {
  const features = geojson.features.map((feature) => {
    if (!feature.properties) return feature;
    const { properties } = feature;
    const { pop, ef } = properties;
    return {
      ...feature,
      properties: {
        ...properties,
        efr: ef && pop ? (ef / pop) * 1000 : null, // filings per 1000 renters
      },
    };
  });
  return {
    ...geojson,
    features,
  };
};

/**
 * Merges GeoJSON data and data fetched from the API endpoint
 */
const fetchAllBubbleData = (params, geojsonUrl) => {
  return Promise.all([
    fetchBubbleGeojson(geojsonUrl),
    fetchBubbleData(params),
  ]).then(([geojson, evictionData]) => {
    if (!geojson || !evictionData) return null;
    const mergedGeojson = addFilingRatesToGeojson(
      addDataToGeojson(addFeatureIds(geojson), evictionData.result)
    );
    return {
      extents: extractExtentsFromGeojson(mergedGeojson),
      geojson: mergedGeojson,
    };
  });
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
  const region = regions.find((r) => r.id === activeRegion);
  const geojsonUrl = region && region["bubble"];
  // update the data on changes
  return useQuery(["bubbles", activeRegion, start, end], () =>
    fetchAllBubbleData({ region: activeRegion, start, end }, geojsonUrl)
  );
}
