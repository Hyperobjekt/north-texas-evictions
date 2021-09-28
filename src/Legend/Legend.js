import React, { useState } from "react";
import { Box, Paper, Typography, withStyles, Button } from "@material-ui/core";
import { useLang } from "../Language";
import { animated, useSpring } from "react-spring";
import Summary from "./components/Summary";
import BubbleLegend from "./components/BubbleLegend";
import ChoroplethLegend from "./components/ChoroplethLegend";
import useMeasure from "react-use-measure";
import { Stack } from "@hyperobjekt/material-ui-website";
import useDashboardBubble from "../Dashboard/hooks/useDashboardBubble";
import useDashboardChoropleth from "../Dashboard/hooks/useDashboardChoropleth";
import useDashboardDateRange from "../Dashboard/hooks/useDashboardDateRange";
import DataFlags from "./components/DataFlags";
import useDateOptions from "../Dashboard/hooks/useDateOptions";
import LegendRow from "./components/LegendRow";
import useMediaQueries from "../App/hooks/useMediaQueries";
import useDataFlags from "./hooks/useDataFlags";
import CurrentView from "./components/CurrentView";
import { formatDateString } from "./utils";
import ToggleOptions from "./components/ToggleOptions";
// import useTogglePanel from "../Panel/useTogglePanel";

/**
 * Returns a shortened label for the date range text in the legend
 * @param {*} start
 * @param {*} end
 * @returns
 */
export const getShortDateRangeLabel = (start, end) => {
  if (!start || !end) return "";
  return formatDateString(start, end, {
    short: true,
  }).join(" - ");
};

const styles = (theme) => ({
  root: {
    position: "absolute",
    top: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 10,
    width: 320,
    pointerEvents: "all",
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
  const { isMobile } = useMediaQueries();

  const [activeDateRange] = useDashboardDateRange();
  const dateOptions = useDateOptions();
  const [activeBubble] = useDashboardBubble();
  const [activeChoropleth] = useDashboardChoropleth();

  // prepare language
  const langKeys = [
    `METRIC_${activeBubble}`,
    `METRIC_${activeChoropleth}`,
    `SUMMARY`,
    `LEGEND`,
    `LEGEND_TITLE`,
    `LABEL_SHOW_LEGEND`,
    `LABEL_HIDE_LEGEND`,
  ];
  const [
    bubbleName,
    choroplethName,
    summaryHeading,
    legendHeading,
    legendTitle,
    showLegendLabel,
    hideLegendLabel,
  ] = useLang(langKeys);

  // measure the width / height of the bottom sections of the legend
  const [toggleRef, toggleBounds] = useMeasure();

  // state for showing the legend on mobile
  const [showSummary, setShowSummary] = useState(false);

  // pull flags based on current data options
  const flags = useDataFlags();

  // move legend if panel is open
  const style = useSpring({
    y: isMobile && !showSummary ? toggleBounds.height : 0,
  });
  // const handleToggle = useTogglePanel();

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
        <CurrentView around="none" />
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
          <ToggleOptions />
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
            <DataFlags flags={flags} />
          </Stack>
        </Box>
      </animated.div>
    </AnimatedPaper>
  );
};

export default withStyles(styles)(Legend);
