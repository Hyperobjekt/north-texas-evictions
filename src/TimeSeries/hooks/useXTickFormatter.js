import shallow from "zustand/shallow";
import { useDashboardStore } from "../../Dashboard";
import { getXTickFormatter } from "../utils";
import useTimeSeriesStore from "./useTimeSeriesStore";

/**
 * Returns a formatter function for x axis ticks based on current state
 * @returns
 */
export default function useXTickFormatter() {
  const group = useTimeSeriesStore((state) => state.group);
  const activeDateRange = useDashboardStore(
    (state) => state.activeDateRange,
    shallow
  );
  const startYear = activeDateRange[0].split("-")[0];
  const endYear = activeDateRange[1].split("-")[0];
  const sameYear = endYear === startYear;
  return getXTickFormatter({ group, includeYear: !sameYear });
}
