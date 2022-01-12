import { useQuery } from "react-query";

/**
 *
 */
export const fetchEvents = (url) => {
  if (!url) return Promise.reject("no url provided for choropleth geojson");
  return fetch(url)
    .then((response) => response.text())
    .then((csv) => {
      // process csv
    });
};

/**
 *
 */
export function useTimeSeriesEventData() {
  return useQuery("events", () =>
    fetchEvents("/assets/time-series-events.csv")
  );
}
