import { useCallback } from "react";
import shallow from "zustand/shallow";
import useDashboardStore from "../Dashboard/hooks/useDashboardStore";

export default function usePrecinctFilter() {
  const [filters, setFilters] = useDashboardStore(
    (state) => [state.filters, state.setFilters],
    shallow
  );
  const precinct = filters.find((f) => f[0] === "precinct")?.[1];
  const setPrecinct = useCallback(
    (value) => {
      const filterValue = value
        ? [...filters.filter((f) => f[0] !== "precinct"), ["precinct", value]]
        : filters.filter((f) => f[0] !== "precinct");
      setFilters(filterValue);
    },
    [setFilters, filters]
  );
  return [precinct, setPrecinct];
}
