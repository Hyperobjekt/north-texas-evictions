import shallow from "zustand/shallow";
import { formatDate, parseDate } from "../utils";
import useDashboardStore from "./useDashboardStore";

export default function useDateOptions() {
  const dateRange = useDashboardStore((state) => state.dateRange, shallow);

  return [
    {
      label: "last 7 days",
      value: [
        formatDate(
          parseDate(dateRange[1]).setDate(parseDate(dateRange[1]).getDate() - 7)
        ),
        formatDate(parseDate(dateRange[1])),
      ],
    },
    {
      label: "last 30 days",
      value: [
        formatDate(
          parseDate(dateRange[1]).setDate(
            parseDate(dateRange[1]).getDate() - 30
          )
        ),
        formatDate(parseDate(dateRange[1])),
      ],
    },
    {
      label: "last 90 days",
      value: [
        formatDate(
          parseDate(dateRange[1]).setDate(
            parseDate(dateRange[1]).getDate() - 90
          )
        ),
        formatDate(parseDate(dateRange[1])),
      ],
    },
    {
      label: "last 365 days",
      value: [
        formatDate(
          parseDate(dateRange[1]).setDate(
            parseDate(dateRange[1]).getDate() - 365
          )
        ),
        formatDate(parseDate(dateRange[1])),
      ],
    },
    {
      label: "All Time",
      value: [
        formatDate(parseDate(dateRange[0])),
        formatDate(parseDate(dateRange[1])),
      ],
    },
    {
      label: "Custom...",
      value: null,
    },
  ];
}
