import React from "react";
import { parseDate, useDashboardStore } from "../../Dashboard";
import { withStyles } from "@material-ui/core";
import shallow from "zustand/shallow";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { ArrowDropDown } from "@material-ui/icons";
import { format } from "date-fns";
import clsx from "clsx";

const styles = (theme) => ({
  root: {
    "& .MuiInputAdornment-root": {
      position: "absolute",
      right: theme.spacing(-0.5),
    },
  },
});

/**
 * Returns true if the date is in the correct format
 * and is valid for the given range.
 */
const isValidDate = (dateString, dateRange) => {
  const isIso8601 = /^\d{4}-\d{2}-\d{2}$/.test(dateString);
  if (!isIso8601) return false;
  const date = parseDate(dateString);
  const startDate = parseDate(dateRange[0]);
  const endDate = parseDate(dateRange[1]);
  return date >= startDate && date <= endDate;
};

/**
 * Start/end date picker
 */
const DateSelect = ({ type = "start", classes, ...props }) => {
  const [dateRange, activeDateRange, setActiveDateRange] = useDashboardStore(
    (state) => [
      state.dateRange,
      state.activeDateRange,
      state.setActiveDateRange,
    ],
    shallow
  );
  const isStart = type === "start";
  const handleChange = (date) => {
    const value = format(date, "yyyy-MM-dd");
    if (isValidDate(value, dateRange)) {
      isStart
        ? setActiveDateRange([value, activeDateRange[1]])
        : setActiveDateRange([activeDateRange[0], value]);
    }
  };
  const isReady = activeDateRange[isStart ? 0 : 1];
  return isReady ? (
    <KeyboardDatePicker
      id={`date-select-${type}`}
      variant="inline"
      value={
        isStart ? parseDate(activeDateRange[0]) : parseDate(activeDateRange[1])
      }
      onChange={handleChange}
      format={"MM/dd/yyyy"}
      className={clsx(classes.root)}
      keyboardIcon={<ArrowDropDown />}
      minDate={
        isStart ? parseDate(dateRange[0]) : parseDate(activeDateRange[0])
      }
      maxDate={
        isStart ? parseDate(activeDateRange[1]) : parseDate(dateRange[1])
      }
      autoOk
    />
  ) : null;
};

DateSelect.propTypes = {};

export default withStyles(styles)(DateSelect);
