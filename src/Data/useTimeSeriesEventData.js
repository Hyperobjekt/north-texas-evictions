import { useQuery } from "react-query";
import { csvParse } from "d3-dsv";
import { EVENT_COLORS } from "../Dashboard/constants";

/**
 *
 */
export const fetchEvents = (url) => {
  if (!url) return Promise.reject("no url provided for series event data");
  return fetch(url)
    .then((response) => response.text())
    .then((csv) => {
      let count = 0;
      return csvParse(csv, (d) => {
        d.end = d.end === "" ? (d.end = d.start) : d.end;
        d["color"] = EVENT_COLORS[count % EVENT_COLORS.length];
        d["id"] = count + 1;
        count++;
        return d;
      });
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
