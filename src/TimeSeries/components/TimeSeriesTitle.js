import React from "react";
import { Typography, Box } from "@material-ui/core";
import { ArrowDropDown } from "@material-ui/icons";
import { useLang } from "../../Language";
import {
  useDashboardStore,
  useDashboardBubble,
  useDashboardDateRange,
  useDateOptions,
  InlineMenu,
  formatDateString,
} from "../../Dashboard";
import useTimeSeriesStore from "../hooks/useTimeSeriesStore";
import shallow from "zustand/shallow";
import useTimeSeriesGroupOptions from "../hooks/useTimeSeriesGroupOptions";

/**
 * Returns a prefix and label for the date range text in the legend
 * TODO: move hard coded strings to language dictionary
 * @param {*} start
 * @param {*} end
 * @returns
 */
const getDateRangeLabel = (start, end, dateOptions) => {
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

const TimeSeriesTitle = ({ ...props }) => {
  const setActivePanel = useDashboardStore((state) => state.setActivePanel);
  const [activeDateRange, setActiveDateRange] = useDashboardDateRange();
  const dateOptions = useDateOptions();
  const [activeBubble, setActiveBubble, bubbleMetrics] = useDashboardBubble();
  const groupOptions = useTimeSeriesGroupOptions();
  const [group, setGroup] = useTimeSeriesStore(
    (state) => [state.group, state.setGroup],
    shallow
  );
  const groupLabel = groupOptions.find((option) => option.id === group).label;

  // prepare language
  const bubbleName = useLang(`METRIC_${activeBubble}`);

  // date labels
  const [datePrefix, dateLabel] = getDateRangeLabel(
    ...activeDateRange,
    dateOptions
  );

  const handleSetDateRange = (e, option) => {
    option?.value && setActiveDateRange(option.value);
    if (!option?.value && option !== "backdropClick") {
      setActivePanel("DATA_OPTIONS");
    }
  };

  const handleSetGroup = (e, option) => {
    option?.value && setGroup(option.value);
  };

  return (
    <Box clone display="flex" flexWrap="wrap" alignItems="baseline" {...props}>
      <Typography variant="h2" color="textSecondary">
        <InlineMenu
          options={bubbleMetrics}
          color="primary"
          selected={activeBubble}
          onSelect={(e, option) => {
            option?.id && setActiveBubble(option.id);
          }}
        >
          {bubbleName}{" "}
          <ArrowDropDown style={{ margin: "-0.75em 0em -0.3em -0.2em" }} />
        </InlineMenu>
        <span style={{ marginRight: "0.4em" }}>{datePrefix}</span>
        <InlineMenu options={dateOptions} onSelect={handleSetDateRange}>
          {dateLabel}{" "}
          <ArrowDropDown style={{ margin: "-0.75em 0em -0.3em -0.2em" }} />
        </InlineMenu>
        <span style={{ marginRight: "0.4em" }}>by</span>
        <InlineMenu options={groupOptions} onSelect={handleSetGroup}>
          {groupLabel}{" "}
          <ArrowDropDown style={{ margin: "-0.75em 0em -0.3em -0.2em" }} />
        </InlineMenu>
      </Typography>
    </Box>
  );
};

export default TimeSeriesTitle;
