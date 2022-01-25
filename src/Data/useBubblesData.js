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
  if (!start || !end) {
    return Promise.reject("no dates provided for bubble data");
  }
  const params = { region, start, end };
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
  const { rhh, ef, id } = properties;
  // TODO: temporarily filtering out filing rate for specific tract, remove this when it has a more accurate rental households value
  if (id === "48113014002") {
    console.warn("filtering out eviction filing rate for census tract 140.02");
    return null;
  }
  return ef && rhh ? (ef / rhh) * 1000 : null;
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
  const bubbleLayer = region?.layers?.find((l) => l.id === "bubble");
  const geojsonUrl = bubbleLayer?.source;
  // update the data on changes
  return useQuery(["bubbles", activeRegion, start, end], () =>
    fetchAllBubbleData({ region: activeRegion, start, end }, geojsonUrl)
  );
}
