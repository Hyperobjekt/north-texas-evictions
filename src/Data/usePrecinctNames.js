import { useRegionNames } from "./useChoroplethData";
import usePrecinctData from "./usePrecinctData";

/**
 * Returns an object containing precinct IDs mapped to their names.
 * @returns {object} { [precinctId]: precinctName}
 */
export default function usePrecinctNames() {
  const { data: countyDict } = useRegionNames("counties");
  const { data: precincts } = usePrecinctData();
  if (!countyDict || !precincts) return {};
  const precinctDict = {};
  for (const precinct of precincts) {
    const county = countyDict[precinct.countyId];
    if (!county) continue;
    precinctDict[precinct.id] = `${county} (Court ${precinct.court})`;
  }
  return precinctDict;
}
