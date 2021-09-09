import { useQuery } from "react-query";
import { EVICTION_DATA_ENDPOINT } from "../Dashboard/constants";

/**
 * Parses the precinct id into its parts
 * @param {*} precinct
 * @returns
 */
const getPrecinctParts = (precinct) => {
  const countyId = precinct.slice(0, 5);
  const courtId = precinct.slice(5);
  const parts = courtId.match(/[0-9]{1}/g);
  return {
    id: precinct,
    countyId,
    court: parts.join("-"),
    courtId,
  };
};

/**
 * Fetches eviction filings data from the API
 */
const fetchPrecincts = () => {
  return fetch(`${EVICTION_DATA_ENDPOINT}/precincts`)
    .then((response) => response.json())
    .then((json) => {
      return json.map((p) => getPrecinctParts(p.precinct_id));
    });
};

/**
 * Returns a [query object](https://react-query.tanstack.com/guides/queries#query-basics)
 * containing a list of precincts
 */
export default function usePrecinctData() {
  return useQuery(["precincts"], () => fetchPrecincts());
}
