import React from "react";
import useDashboardStore from "../hooks/useDashboardStore";
import { TextField } from "@material-ui/core";
import { useLang } from "../../Language";
import shallow from "zustand/shallow";

/**
 * Returns true if the date is in the correct format
 * and is valid for the given range.
 */
const isValidDate = (dateString, dateRange) => {
  const isIso8601 = /^\d{4}-\d{2}-\d{2}$/.test(dateString);
  if (!isIso8601) return false;
  const date = new Date(dateString);
  const startDate = new Date(dateRange[0]);
  const endDate = new Date(dateRange[1]);
  return date >= startDate && date <= endDate;
};

/**
 * Text field for start date
 * TODO: switch to date picker for entry
 */
const DateSelect = ({ type = "start", ...props }) => {
  const [dateRange, activeDateRange, setActiveDateRange] = useDashboardStore(
    (state) => [
      state.dateRange,
      state.activeDateRange,
      state.setActiveDateRange,
    ],
    shallow
  );
  const isStart = type === "start";
  const label = useLang(isStart ? `SELECT_DATE_START` : `SELECT_DATE_END`);
  const handleChange = (event) => {
    const value = event.target.value;
    if (isValidDate(value, dateRange)) {
      isStart
        ? setActiveDateRange([value, activeDateRange[1]])
        : setActiveDateRange([activeDateRange[0], value]);
    }
  };
  const isReady = activeDateRange[isStart ? 0 : 1];
  return isReady ? (
    <TextField
      id={`date-select-${type}`}
      label={label}
      defaultValue={isStart ? activeDateRange[0] : activeDateRange[1]}
      onChange={handleChange}
    />
  ) : null;
};

DateSelect.propTypes = {};

export default DateSelect;
