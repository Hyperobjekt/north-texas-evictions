import { timeFormat, timeParse } from "d3-time-format";

export const formatDate = timeFormat("%Y-%m-%d");

export const parseDate = timeParse("%Y-%m-%d");

/**
 * Formats the custom date range lable for the legend
 * @param {*} start
 * @param {*} end
 * @returns
 */
export const formatDateString = (
  start,
  end,
  options = { short: false, point: false }
) => {
  if (!start || !end) return ["", ""];

  const startDate = parseDate(start);
  const endDate = parseDate(end);

  //if not formatting a date range
  if (options.point) {
    return new Intl.DateTimeFormat("en-US", {
      month: options.short ? "short" : "long",
      day: "numeric",
      year: "numeric",
    }).format(startDate);
  }

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

/**
 * Returns a prefix and label for the date range text in the legend
 * TODO: move hard coded strings to language dictionary
 * @param {*} start
 * @param {*} end
 * @returns
 */
export const getDateRangeLabel = (start, end, dateOptions) => {
  if (!start || !end) return "";
  const selectedOption = dateOptions.find((option) => {
    if (!option.value || option.value.length !== 2) return false;
    return option.value[0] === start && option.value[1] === end;
  });
  if (!selectedOption)
    return ["between", formatDateString(start, end).join(" and ")];
  if (selectedOption.id === "alltime") return ["for", "all time"];
  if (selectedOption.id === "2020") return ["", "since 2020"];
  return ["in the", selectedOption.label];
};
