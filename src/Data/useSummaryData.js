import { useQuery } from "react-query";
import { EVICTION_DATA_ENDPOINT } from "../Dashboard/constants";
import useDashboardStore from "../Dashboard/hooks/useDashboardStore";
import { getDailyAverage } from "../TimeSeries/utils";
import usePrecinctFilter from "./usePrecinctFilter";

/**
 * Fetches eviction filings data from the API
 */
const fetchSummary = ({ start, end, precinct }) => {
  if (!start || !end) {
    return Promise.reject("start and end dates are required");
  }
  const params = { start, end };
  if (precinct) {
    params["precinct"] = precinct;
  }
  const paramString = new URLSearchParams(params).toString();
  return fetch(`${EVICTION_DATA_ENDPOINT}/summary?${paramString}`)
    .then((response) => response.json())
    .then((summary) => {
      return fetch(`${EVICTION_DATA_ENDPOINT}/filings?${paramString}`)
        .then((response) => response.json())
        .then((series) => {
          return {
            ef: summary.result.reduce((sum, entry) => sum + entry.ef, 0),
            tfa: summary.result.reduce((sum, entry) => sum + entry.tfa, 0),
            series: series.result,
            avg7: getDailyAverage(series.result, 7),
            avg30: getDailyAverage(series.result, 30),
            past7: getDailyAverage(series.result, 7, -7),
            past30: getDailyAverage(series.result, 30, -30),
          };
        });
    });
};

/**
 * Provides total amount filed, total number of filings, and time series data
 * for the current time range.
 * TODO: update backend call to return total filing amount and time series
 */
export default function useSummaryData() {
  const activeDateRange = useDashboardStore((state) => state.activeDateRange);
  const [precinct] = usePrecinctFilter();
  return useQuery(["summary", ...activeDateRange, precinct], () =>
    fetchSummary({
      start: activeDateRange[0],
      end: activeDateRange[1],
      precinct,
    })
  );
}
