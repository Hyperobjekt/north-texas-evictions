import React, { useState } from "react";
import PropTypes from "prop-types";
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
import { ArrowDropUp, Close } from "@material-ui/icons";
import useMeasure from "react-use-measure";

const styles = (theme) => ({
  root: {
    position: "absolute",
    top: theme.spacing(2),
    right: theme.spacing(2),
    padding: theme.spacing(2, 0, 0),
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
    margin: 0,
    [theme.breakpoints.down("sm")]: {
      // TODO: abstract the mobile toggle btn width to a constant
      marginRight: "63px",
    },
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
      paddingTop: 0,
    },
  },
  toggleContainer: {
    overflow: "hidden",
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
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

  const [toggleRef, toggleBounds] = useMeasure();
  const [showSummary, setShowSummary] = useState(() => !isMobile);
  const toggleStyle = useSpring({
    height: showSummary ? toggleBounds.height : 0,
  });
  console.log(isMobile, showSummary);

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
      </Box>
      <animated.div style={toggleStyle} className={classes.toggleContainer}>
        <div ref={toggleRef}>
          <Box className={classes.box}>
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
        </div>
      </animated.div>
      {isMobile && (
        <MobileToggle
          active={showSummary}
          onClick={() => setShowSummary((ss) => !ss)}
        />
      )}
    </AnimatedPaper>
  );
};

Legend.propTypes = {};

export default withStyles(styles)(Legend);
