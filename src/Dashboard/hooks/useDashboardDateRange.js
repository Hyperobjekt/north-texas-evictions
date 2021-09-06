import shallow from "zustand/shallow";
import useDashboardStore from "./useDashboardStore";

export default function useDashboardDateRange() {
  const [activeDateRange, setActiveDateRange, dateRange] = useDashboardStore(
    (state) => [
      state.activeDateRange,
      state.setActiveDateRange,
      state.dateRange,
    ],
    shallow
  );
  return [activeDateRange, setActiveDateRange, dateRange];
}
