import shallow from "zustand/shallow";
import { formatDateRange } from "..";
import { formatDate, parseDate } from "../utils";
import useDashboardStore from "./useDashboardStore";

export default function useDateOptions() {
  const dateRange = useDashboardStore((state) => state.dateRange, shallow);
  return [
    {
      id: "7",
      label: "last 7 days",
      value: [
        formatDate(
          parseDate(dateRange[1]).setDate(parseDate(dateRange[1]).getDate() - 7)
        ),
        formatDate(parseDate(dateRange[1])),
      ],
    },
    {
      id: "30",
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
      id: "90",
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
      id: "365",
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
      id: "2020",
      label: "since 2020",
      value: ["2020-01-01", formatDate(parseDate(dateRange[1]))],
    },
    {
      id: "alltime",
      label: `All Time (${formatDateRange(...dateRange, { short: true }).join(
        " - "
      )})`,
      value: [
        formatDate(parseDate(dateRange[0])),
        formatDate(parseDate(dateRange[1])),
      ],
    },
    {
      id: "custom",
      label: "Custom range...",
      value: null,
    },
  ];
}
