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
    .then((summary) => {
      return fetch(`${EVICTION_DATA_ENDPOINT}/filings?${paramString}`)
        .then((response) => response.json())
        .then((series) => {
          return {
            filings: summary.result.reduce((sum, entry) => sum + entry.ef, 0),
            amount: summary.result.reduce((sum, entry) => sum + entry.tfa, 0),
            series: series.result,
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
  return useQuery(["summary", ...activeDateRange], () =>
    fetchSummary({ start: activeDateRange[0], end: activeDateRange[1] })
  );
}
