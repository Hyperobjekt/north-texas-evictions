import { useQuery } from "react-query";
import { csvParse } from "d3-dsv";
import { EVENT_COLORS } from "../../Dashboard/constants";

/**
 * Fetches events from a csv file in the repo
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

export function useTimeSeriesEventData(dataUrl) {
  return useQuery(dataUrl, () => fetchEvents(dataUrl));
}
