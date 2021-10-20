import shallow from "zustand/shallow";
import { useDashboardStore } from "../../Dashboard";

function getDaysBetween(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

const byDay = {
  id: "daily",
  label: "daily total",
  value: "daily",
  minRange: 1,
};
const byWeek = {
  id: "weekly",
  label: "weekly total",
  value: "weekly",
  minRange: 30,
};
const byMonth = {
  id: "monthly",
  label: "monthly total",
  value: "monthly",
  minRange: 60,
};
const bySevenDayAverage = {
  id: "avg7",
  label: "7 Day Average",
  value: "avg7",
  minRange: 14,
};
const byThirtyDayAverage = {
  id: "avg30",
  label: "30 Day Average",
  value: "avg30",
  minRange: 89,
};

export default function useTimeSeriesGroupOptions() {
  const dateRange = useDashboardStore(
    (state) => state.activeDateRange,
    shallow
  );
  const daysBetween = getDaysBetween(...dateRange);
  const options = [
    byDay,
    byWeek,
    byMonth,
    bySevenDayAverage,
    byThirtyDayAverage,
  ];
  return options.map((option) => ({
    ...option,
    unavailable: option.minRange && option.minRange > daysBetween,
  }));
}
