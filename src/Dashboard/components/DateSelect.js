import React from "react";
import useDashboardStore from "../hooks/useDashboardStore";
import { TextField, withStyles } from "@material-ui/core";
import { useLang } from "../../Language";
import shallow from "zustand/shallow";
import { KeyboardDatePicker } from "@material-ui/pickers";
import clsx from "clsx";
import { ArrowDropDown } from "@material-ui/icons";
import { format } from "date-fns";

const styles = (theme) => ({
  root: {
    "& .MuiInputAdornment-root": {
      position: "absolute",
      right: theme.spacing(-1),
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
  const date = new Date(`${dateString}T00:00:00`);
  const startDate = new Date(`${dateRange[0]}T00:00:00`);
  const endDate = new Date(`${dateRange[1]}T00:00:00`);
  return date >= startDate && date <= endDate;
};

/**
 * Text field for start date
 * TODO: switch to date picker for entry
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
        isStart
          ? new Date(`${activeDateRange[0]}T00:00:00`)
          : new Date(`${activeDateRange[1]}T00:00:00`)
      }
      onChange={handleChange}
      format={"MM/dd/yyyy"}
      keyboardIcon={<ArrowDropDown />}
      className={clsx(classes.root)}
    />
  ) : null;
};

DateSelect.propTypes = {};

export default withStyles(styles)(DateSelect);
