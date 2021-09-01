import { useQuery } from "react-query";
import { EVICTION_DATA_ENDPOINT } from "../Dashboard/constants";
import useDashboardStore from "../Dashboard/hooks/useDashboardStore";

/**
 * Fetches eviction filings data from the API
 */
const fetchSummary = ({ start, end }) => {
  const paramString = new URLSearchParams({ start, end }).toString();
  return fetch(`${EVICTION_DATA_ENDPOINT}/summary?${paramString}`)
    .then((response) => response.json())
    .then((json) => {
      // console.log("json", json);
      return {
        filings: json.result.reduce((sum, entry) => sum + entry.ef, 0),
        amount: json.result.reduce((sum, entry) => sum + entry.tfa, 0),
        series: [
          { date: start, filings: 10 },
          { date: end, filings: 20 },
        ], // TODO: replace with real value from API when available
      };
    });
};

/**
 * Provides total amount filed, total number of filings, and time series data
 * for the current time range.
 * TODO: update backend call to return total filing amount and time series
 */
export default function useSummaryData() {
  const activeDateRange = useDashboardStore((state) => state.activeDateRange);
  return useQuery(["summary", ...activeDateRange], () =>
    fetchSummary({ start: activeDateRange[0], end: activeDateRange[1] })
  );
}
