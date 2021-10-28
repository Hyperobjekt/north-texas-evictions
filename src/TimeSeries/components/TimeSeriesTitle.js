import React from "react";
import { Typography } from "@material-ui/core";
import { useLang } from "../../Language";
import {
  useDashboardStore,
  useDashboardBubble,
  useDashboardDateRange,
  useDateOptions,
  InlineMenu,
  getDateRangeLabel,
} from "../../Dashboard";
import useTimeSeriesStore from "../hooks/useTimeSeriesStore";
import shallow from "zustand/shallow";
import useTimeSeriesGroupOptions from "../hooks/useTimeSeriesGroupOptions";
import { Stack } from "@hyperobjekt/material-ui-website";

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
    <Stack
      flexWrap="wrap"
      alignItems="baseline"
      fontSize={14}
      between="sm"
      around="md"
      style={{
        background:
          "linear-gradient(rgba(255,255,255,1), rgba(255,255,255,0.5))",
        backdropFilter: `blur(2px)`,
        marginBottom: -48,
      }}
      {...props}
    >
      <InlineMenu
        options={bubbleMetrics.filter((metric) => metric.id !== "mfa")}
        color="primary"
        selected={activeBubble}
        onSelect={(e, option) => {
          option?.id && setActiveBubble(option.id);
        }}
      >
        {bubbleName}{" "}
      </InlineMenu>
      <Typography component="span">{datePrefix}</Typography>
      <InlineMenu options={dateOptions} onSelect={handleSetDateRange}>
        {dateLabel}{" "}
      </InlineMenu>
      <Typography component="span">by</Typography>
      <InlineMenu options={groupOptions} onSelect={handleSetGroup}>
        {groupLabel}{" "}
      </InlineMenu>
    </Stack>
  );
};

export default TimeSeriesTitle;
