import { parseDate } from "../Dashboard";

/**
 * Formats the custom date range lable for the legend
 * @param {*} start
 * @param {*} end
 * @returns
 */
export const formatDateString = (start, end, options = { short: false }) => {
  if (!start || !end) return ["", ""];
  const startDate = parseDate(start);
  const endDate = parseDate(end);

  const startDateLabel = new Intl.DateTimeFormat("en-US", {
    month: options.short ? "short" : "long",
    day: "numeric",
    year:
      startDate.getFullYear() === endDate.getFullYear() ? undefined : "numeric",
  }).format(startDate);
  const endDateLabel = new Intl.DateTimeFormat("en-US", {
    month: options.short ? "short" : "long",
    day: "numeric",
    year: "numeric",
  }).format(endDate);
  const shortEndDateLabel = endDateLabel.split(" ").slice(1).join(" ");
  return options.short &&
    startDate.getFullYear() === endDate.getFullYear() &&
    startDate.getMonth() === endDate.getMonth()
    ? [startDateLabel, shortEndDateLabel]
    : [startDateLabel, endDateLabel];
};
