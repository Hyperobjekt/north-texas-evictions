import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  withStyles,
  useTheme,
  Button,
} from "@material-ui/core";
import useDashboardStore from "../Dashboard/hooks/useDashboardStore";
import { useLang } from "../Language";
import { animated, useSpring } from "react-spring";
import Summary from "./components/Summary";
import BubbleLegend from "./components/BubbleLegend";
import ChoroplethLegend from "./components/ChoroplethLegend";
import { ArrowDropDown } from "@material-ui/icons";
import useMeasure from "react-use-measure";
import { Stack } from "@hyperobjekt/material-ui-website";
import InlineMenu from "./components/InlineMenu";
import useDashboardBubble from "../Dashboard/hooks/useDashboardBubble";
import useDashboardChoropleth from "../Dashboard/hooks/useDashboardChoropleth";
import useDashboardRegion from "../Dashboard/hooks/useDashboardRegion";
import useDashboardDateRange from "../Dashboard/hooks/useDashboardDateRange";
import DataFlags from "./components/DataFlags";
import useDateOptions from "../Dashboard/hooks/useDateOptions";
import { parseDate } from "../Dashboard/utils";
import usePrecinctFilter from "../Data/usePrecinctFilter";
import usePrecinctNames from "../Data/usePrecinctNames";
import LegendRow from "./components/LegendRow";
import useTogglePanel from "../Panel/useTogglePanel";
import useMediaQueries from "../App/hooks/useMediaQueries";
import useDashboardStatus from "../Dashboard/hooks/useDashboardStatus";

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
  if (selectedOption.label === "All Time") return ["for", "all time"];
  return ["in the", selectedOption.label];
};

/**
 * Returns a shortened label for the date range text in the legend
 * @param {*} start
 * @param {*} end
 * @returns
 */
const getShortDateRangeLabel = (start, end) => {
  if (!start || !end) return "";
  return formatDateString(start, end, {
    short: true,
  }).join(" - ");
};

/**
 * Formats the custom date range lable for the legend
 * @param {*} start
 * @param {*} end
 * @returns
 */
const formatDateString = (start, end, options = { short: false }) => {
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

const styles = (theme) => ({
  root: {
    position: "absolute",
    top: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 10,
    width: 320,
    [theme.breakpoints.down("xs")]: {
      top: "auto",
      bottom: 0,
      right: 0,
      width: "100vw",
    },
  },
  box: {
    borderTop: "1px solid #E0E0E0",
    padding: theme.spacing(2),
    "& strong": {
      fontWeight: 500,
    },
  },
  buttonRow: {
    width: "100%",
    // first button is full width
    "& > *:first-child": {
      flex: 1,
    },
  },
  toggleContainer: {},
});

const AnimatedPaper = animated(Paper);

const Legend = ({ classes, ...props }) => {
  const theme = useTheme();
  const { isMobile } = useMediaQueries();

  const setActivePanel = useDashboardStore((state) => state.setActivePanel);
  const [activeDateRange, setActiveDateRange] = useDashboardDateRange();
  const dateOptions = useDateOptions();
  const [activeRegion, setActiveRegion, regions] = useDashboardRegion();
  const [activeBubble, setActiveBubble, bubbleMetrics] = useDashboardBubble();
  const [activeChoropleth, setActiveChoropleth, choroplethMetrics] =
    useDashboardChoropleth();

  // useDashboardStatus();
  console.count("Legend");

  // prepare language
  const langKeys = [
    `METRIC_${activeBubble}`,
    `METRIC_${activeChoropleth}`,
    `REGION_${activeRegion}`,
    `SUMMARY`,
    `LEGEND`,
    `LEGEND_TITLE`,
    `LABEL_SHOW_LEGEND`,
    `LABEL_HIDE_LEGEND`,
    `LABEL_SHOW_DATA_OPTIONS`,
  ];
  const [
    bubbleName,
    choroplethName,
    regionName,
    summaryHeading,
    legendHeading,
    legendTitle,
    showLegendLabel,
    hideLegendLabel,
    showDataOptionsLabel,
  ] = useLang(langKeys);

  // date labels
  const [datePrefix, dateLabel] = getDateRangeLabel(
    ...activeDateRange,
    dateOptions
  );

  const [toggleRef, toggleBounds] = useMeasure();
  const [showSummary, setShowSummary] = useState(false);

  // get active precinct filter (if any)
  const [precinct] = usePrecinctFilter();
  const precinctNames = usePrecinctNames();
  const precinctLabel = <span> for {precinctNames[precinct]}</span>;

  // move legend if panel is open
  const activePanel = useDashboardStore((state) => state.activePanel);
  const style = useSpring({
    x: activePanel ? toggleBounds.width + theme.spacing(2) : 0,
    y: isMobile && !showSummary ? toggleBounds.height : 0,
  });
  const handleToggle = useTogglePanel();

  const handleSetDateRange = (e, option) => {
    option?.value && setActiveDateRange(option.value);
    if (!option?.value && option !== "backdropClick") {
      setActivePanel("DATA_OPTIONS");
    }
  };

  return (
    <AnimatedPaper
      style={style}
      elevation={2}
      className={classes.root}
      {...props}
    >
      <Stack direction="vertical" between="sm" around="md">
        <Typography component="h2" variant="overline" color="textSecondary">
          {legendTitle}
        </Typography>
        <InlineMenu
          variant="h2"
          color="textPrimary"
          selected={activeRegion}
          options={regions}
          onSelect={(e, option) => {
            option?.id && setActiveRegion(option.id);
          }}
        >
          {regionName}{" "}
          <ArrowDropDown style={{ margin: "-0.75em 0px -0.3em" }} />
        </InlineMenu>
        <Typography color="textSecondary">
          <InlineMenu
            options={bubbleMetrics}
            color="primary"
            selected={activeBubble}
            onSelect={(e, option) => {
              option?.id && setActiveBubble(option.id);
            }}
          >
            {bubbleName}
          </InlineMenu>
          <span> and </span>
          <InlineMenu
            options={choroplethMetrics}
            color="secondary"
            selected={activeChoropleth}
            onSelect={(e, option) => {
              option?.id && setActiveChoropleth(option.id);
            }}
          >
            {choroplethName}
          </InlineMenu>
          <span> {datePrefix} </span>
          <InlineMenu options={dateOptions} onSelect={handleSetDateRange}>
            {dateLabel}
          </InlineMenu>
          {precinct && precinctLabel}
        </Typography>
        <Stack
          display="flex"
          direction="horizontal"
          justifyContent="stretch"
          around="none"
          between="sm"
          className={classes.buttonRow}
        >
          {isMobile && (
            <Button
              variant="outlined"
              onClick={() => setShowSummary((ss) => !ss)}
            >
              {showSummary ? hideLegendLabel : showLegendLabel}
            </Button>
          )}
          <Button variant="contained" onClick={handleToggle}>
            {showDataOptionsLabel}
          </Button>
        </Stack>
      </Stack>
      <animated.div ref={toggleRef} className={classes.toggleContainer}>
        <Box className={classes.box}>
          <Typography variant="overline" color="textSecondary">
            {summaryHeading.replace(
              "{{dateRange}}",
              getShortDateRangeLabel(...activeDateRange, dateOptions)
            )}
          </Typography>
          <Summary />
        </Box>
        <Box className={classes.box}>
          <Typography variant="overline" color="textSecondary">
            {legendHeading}
          </Typography>
          <Stack direction="vertical" alignItems="stretch" between="none">
            <LegendRow title={bubbleName}>
              <BubbleLegend />
            </LegendRow>
            <LegendRow title={choroplethName}>
              <ChoroplethLegend />
            </LegendRow>
            <DataFlags />
          </Stack>
        </Box>
      </animated.div>
    </AnimatedPaper>
  );
};

export default withStyles(styles)(Legend);
