import { sum } from "d3-array";
import { useQuery } from "react-query";
import { EVICTION_DATA_ENDPOINT } from "../../Dashboard/constants";
import useDashboardStore from "../../Dashboard/hooks/useDashboardStore";
import { fillSeries, getAvgDiffs } from "../utils";

// TODO: sum together the county rhh values to get this number
let RENTER_HOUSEHOLDS = 119335 + 464121 + 101387 + 279622;

/**
 * Fetches eviction filings data from the API
 */
const fetchSummary = ({ start, end }) => {
  if (!start || !end) {
    return Promise.reject("start and end dates are required");
  }
  const params = { start, end };
  // use counties for summary so we can get the median filing amount for Dallas County
  const summaryParams = new URLSearchParams({
    ...params,
    region: "counties",
  }).toString();
  const filingsParams = new URLSearchParams(params).toString();
  return fetch(`${EVICTION_DATA_ENDPOINT}/summary?${summaryParams}`)
    .then((response) => response.json())
    .then((summary) => {
      return fetch(`${EVICTION_DATA_ENDPOINT}/filings?${filingsParams}`)
        .then((response) => response.json())
        .then((series) => {
          const filledSeries = fillSeries(series.result, start, end);
          // pull dallas county from results
          // it is the only location with filing amounts so it is the only
          // place used for total filing amounts + median filing amount
          const dallasCountySummary = summary.result.find(
            (entry) => entry.id === "48113"
          );
          // sum all counties for total eviction filings
          const totalFilings = sum(summary.result, (d) => d.ef);
          const result = {
            ef: totalFilings,
            efr: 1000 * (totalFilings / RENTER_HOUSEHOLDS),
            tfa: dallasCountySummary?.tfa,
            mfa: dallasCountySummary?.mfa,
            // add filings per 1000 renters metric to time series
            series: filledSeries.map((d) => ({
              ...d,
              name: "All Data",
              efr:
                RENTER_HOUSEHOLDS && d.ef
                  ? 1000 * (d.ef / RENTER_HOUSEHOLDS)
                  : null,
            })),
            ...getAvgDiffs(filledSeries),
          };
          return result;
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
    fetchSummary({
      start: activeDateRange[0],
      end: activeDateRange[1],
    })
  );
}
