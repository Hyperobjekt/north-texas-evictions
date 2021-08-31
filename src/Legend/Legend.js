import React from "react";
import PropTypes from "prop-types";
import { Box, Paper, Typography, withStyles } from "@material-ui/core";
import useDashboardStore from "../Dashboard/hooks/useDashboardStore";
import { useLang } from "../Language";
import useDashboardContext from "../Dashboard/hooks/useDashboardContext";
import RegionSelect from "../Dashboard/components/RegionSelect";
import BubbleSelect from "../Dashboard/components/BubbleSelect";
import ChoroplethSelect from "../Dashboard/components/ChoroplethSelect";
import PanelToggle from "../Panel/PanelToggle";
import { animated, useSpring } from "react-spring";
import useSummaryData from "../Data/useSummaryData";
import Summary from "./components/Summary";
import BubbleLegend from "./components/BubbleLegend";
import ChoroplethLegend from "./components/ChoroplethLegend";

const styles = (theme) => ({
  root: {
    position: "absolute",
    top: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 10,
    width: 320,
    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.05)",
    [theme.breakpoints.down("sm")]: {
      top: "auto",
      bottom: 0,
      right: 0,
      width: "100%",
    },
  },
  eyebrow: {
    color: theme.props.text.secondary,
    textTransform: "uppercase",
    fontSize: theme.typography.pxToRem(12),
    lineHeight: theme.typography.pxToRem(16),
    letterSpacing: "0.09em",
    margin: theme.spacing(0, 0, 2),
  },
  region: {
    color: theme.props.text.primary,
    fontSize: theme.typography.pxToRem(16),
    lineHeight: theme.typography.pxToRem(16),
    margin: theme.spacing(0, 0, 1),
    fontWeight: 500,
  },
  body: {
    color: theme.props.text.secondary,
    fontSize: theme.typography.pxToRem(14),
    lineHeight: theme.typography.pxToRem(19),
    margin: theme.spacing(0, 0, 2),
  },
  button: {
    textTransform: "none",
    boxShadow: "none",
    color: theme.props.text.primary,
    background: "#ECECD5",
    fontWeight: 500,
    "&:hover": {
      background: "#D6D6B6",
      boxShadow: "none",
    },
  },
  box: {
    borderTop: "1px solid #E0E0E0",
    padding: theme.spacing(2),
    "&:first-child": {
      borderTop: 0,
    },
  },
});

const AnimatedPaper = animated(Paper);

const formatDateRange = (dR) => {
  return dR && dR.length > 0
    ? {
        start:
          dR.length > 0
            ? new Intl.DateTimeFormat("en-US", {
                month: "long",
                day: "numeric",
              }).format(new Date(dR[0]))
            : "",
        end:
          dR.length > 1
            ? new Intl.DateTimeFormat("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              }).format(new Date(dR[1]))
            : "",
      }
    : {
        start: "",
        end: "",
      };
};

const Legend = ({ classes, ...props }) => {
  const { activeBubble, activeChoropleth, activeRegion, activeDateRange } =
    useDashboardContext();
  console.log(activeDateRange);

  const startDate =
    activeDateRange.length > 0
      ? new Date(`${activeDateRange[0]}T00:00:00`)
      : new Date();
  const endDate =
    activeDateRange.length > 1
      ? new Date(`${activeDateRange[1]}T00:00:00`)
      : new Date();

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

  // prepare language
  const langKeys = [
    `METRIC_${activeBubble}`,
    `METRIC_${activeChoropleth}`,
    `REGION_${activeRegion}`,
  ];
  const [bubbleName, choroplethName, regionName] = useLang(langKeys);
  const summaryText = useLang("LEGEND_SUMMARY", {
    start: startDateLabel,
    end: endDateLabel,
  });

  // move legend if panel is open
  const activePanel = useDashboardStore((state) => state.activePanel);
  const style = useSpring({ x: activePanel ? 368 : 0 });
  return (
    <AnimatedPaper style={style} className={classes.root} {...props}>
      <Box className={classes.box}>
        <Typography className={classes.eyebrow}>Currently Viewing</Typography>
        <Typography className={classes.region}>{regionName}</Typography>
        <Typography className={classes.body}>
          <strong>{bubbleName}</strong>
          <span> and </span>
          <strong>{choroplethName}</strong>
          <span> {summaryText}</span>
        </Typography>
        <PanelToggle className={classes.button} />
      </Box>
      <Box className={classes.box}>
        <Typography className={classes.eyebrow}>Summary</Typography>
        <Summary />
      </Box>
      <Box className={classes.box}>
        <Typography className={classes.eyebrow}>Map Legend</Typography>
        <BubbleLegend title={bubbleName} />
        <ChoroplethLegend title={choroplethName} />
      </Box>
    </AnimatedPaper>
  );
};

Legend.propTypes = {};

export default withStyles(styles)(Legend);
