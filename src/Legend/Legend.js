import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  withStyles,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";
import useDashboardStore from "../Dashboard/hooks/useDashboardStore";
import { useLang } from "../Language";
import PanelToggle from "../Panel/PanelToggle";
import { animated, useSpring } from "react-spring";
import Summary from "./components/Summary";
import BubbleLegend from "./components/BubbleLegend";
import ChoroplethLegend from "./components/ChoroplethLegend";
import { ArrowDropDown, ArrowDropUp, Close } from "@material-ui/icons";
import useMeasure from "react-use-measure";
import { Stack } from "@hyperobjekt/material-ui-website";
import InlineMenu from "./components/InlineMenu";
import useDashboardBubble from "../Dashboard/hooks/useDashboardBubble";
import useDashboardChoropleth from "../Dashboard/hooks/useDashboardChoropleth";
import useDashboardRegion from "../Dashboard/hooks/useDashboardRegion";
import useDashboardDateRange from "../Dashboard/hooks/useDashboardDateRange";
import { formatDate, parseDate } from "../Dashboard/utils";
import DataFlags from "./components/DataFlags";

const DATE_OPTIONS = [
  {
    label: "last 7 days",
    value: [
      formatDate(new Date(new Date().setDate(new Date().getDate() - 7))),
      formatDate(new Date()),
    ],
  },
  {
    label: "last 30 days",
    value: [
      formatDate(new Date(new Date().setDate(new Date().getDate() - 30))),
      formatDate(new Date()),
    ],
  },
  {
    label: "last 90 days",
    value: [
      formatDate(new Date(new Date().setDate(new Date().getDate() - 90))),
      formatDate(new Date()),
    ],
  },
  {
    label: "last 365 days",
    value: [
      formatDate(new Date(new Date().setDate(new Date().getDate() - 365))),
      formatDate(new Date()),
    ],
  },
  {
    label: "All Time",
    value: [
      formatDate(new Date(new Date().setDate(new Date().getDate() - 365 * 5))),
      formatDate(new Date()),
    ],
  },
  {
    label: "Custom...",
    value: null,
  },
];

/**
 * Returns a prefix and label for the date range text in the legend
 * TODO: move hard coded strings to language dictionary
 * @param {*} start
 * @param {*} end
 * @returns
 */
const getDateRangeLabel = (start, end) => {
  if (!start || !end) return "";
  const selectedOption = DATE_OPTIONS.find((option) => {
    if (!option.value || option.value.length !== 2) return false;
    return option.value[0] === start && option.value[1] === end;
  });
  if (!selectedOption)
    return ["between", formatDateString(start, end).join(" and ")];
  if (selectedOption.label === "All Time") return ["for", "all time"];
  return ["in the", selectedOption.label];
};

/**
 * Formats the custom date range lable for the legend
 * @param {*} start
 * @param {*} end
 * @returns
 */
const formatDateString = (start, end) => {
  if (!start || !end) return ["", ""];
  const startDate = parseDate(start);
  const endDate = parseDate(end);

  const startDateLabel = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year:
      startDate.getFullYear() === endDate.getFullYear() ? undefined : "numeric",
  }).format(startDate);
  const endDateLabel = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(endDate);
  return [startDateLabel, endDateLabel];
};

const styles = (theme) => ({
  root: {
    position: "absolute",
    top: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 10,
    width: 320,
    [theme.breakpoints.down("sm")]: {
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
  toggleContainer: {},
});

const AnimatedPaper = animated(Paper);

const MobileToggle = withStyles((theme) => ({
  root: {
    position: "absolute",
    top: theme.spacing(2),
    right: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: 63,
    height: 56,
    background: ({ active }) => (active ? "transparent" : "#ECECD5"),
    border: ({ active }) =>
      active ? "1px solid #EAEAEA" : "1px solid transparent",
    borderRadius: 2,
    paddingBottom: ({ active }) => (active ? "0" : "10px"),
    boxSizing: "border-box",
    "& span": {
      fontSize: theme.typography.pxToRem(12),
      color: theme.props.text.primary,
      margin: ({ active }) => (active ? "0" : "-7px 0 0"),
    },
    "& .MuiSvgIcon-root": {},
  },
}))((props) => {
  return (
    <Box {...props}>
      {props.active ? <Close /> : <ArrowDropUp style={{ fontSize: "2rem" }} />}
      <Typography component="span">
        {props.active ? "Close" : "Legend"}
      </Typography>
    </Box>
  );
});

const Legend = ({ classes, ...props }) => {
  const theme = useTheme();
  const isMobile = !useMediaQuery(theme.breakpoints.up("sm"));

  const setActivePanel = useDashboardStore((state) => state.setActivePanel);
  const [activeDateRange, setActiveDateRange] = useDashboardDateRange();
  const [activeRegion, setActiveRegion, regions] = useDashboardRegion();
  const [activeBubble, setActiveBubble, bubbleMetrics] = useDashboardBubble();
  const [activeChoropleth, setActiveChoropleth, choroplethMetrics] =
    useDashboardChoropleth();

  // prepare language
  const langKeys = [
    `METRIC_${activeBubble}`,
    `METRIC_${activeChoropleth}`,
    `REGION_${activeRegion}`,
    `SUMMARY`,
    `LEGEND`,
    `LEGEND_TITLE`,
  ];
  const [
    bubbleName,
    choroplethName,
    regionName,
    summaryHeading,
    legendHeading,
    legendTitle,
  ] = useLang(langKeys);

  const [toggleRef, toggleBounds] = useMeasure();
  const [showSummary, setShowSummary] = useState(false);

  // move legend if panel is open
  const activePanel = useDashboardStore((state) => state.activePanel);
  const style = useSpring({
    x: activePanel ? toggleBounds.width + theme.spacing(2) : 0,
    y: isMobile && !showSummary ? toggleBounds.height : 0,
  });

  const handleSetDateRange = (e, option) => {
    option?.value && setActiveDateRange(option.value);
    if (!option?.value) {
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
            onSelect={(e, option) => {
              option?.id && setActiveChoropleth(option.id);
            }}
          >
            {choroplethName}
          </InlineMenu>
          <span> {getDateRangeLabel(...activeDateRange)[0]} </span>
          <InlineMenu options={DATE_OPTIONS} onSelect={handleSetDateRange}>
            {getDateRangeLabel(...activeDateRange)[1]}
          </InlineMenu>
        </Typography>
        <PanelToggle />
      </Stack>
      <animated.div ref={toggleRef} className={classes.toggleContainer}>
        <Box className={classes.box}>
          <Typography variant="overline" color="textSecondary">
            {summaryHeading}
          </Typography>
          <Summary />
        </Box>
        <Box className={classes.box}>
          <Typography variant="overline" color="textSecondary">
            {legendHeading}
          </Typography>
          <BubbleLegend title={bubbleName} />
          <ChoroplethLegend title={choroplethName} />
          <DataFlags />
        </Box>
      </animated.div>
      {isMobile && <MobileToggle onClick={() => setShowSummary((ss) => !ss)} />}
    </AnimatedPaper>
  );
};

export default withStyles(styles)(Legend);
