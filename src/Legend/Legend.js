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

const styles = (theme) => ({
  root: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    padding: theme.spacing(2),
    zIndex: 10,
    width: 320,
  },
});

const AnimatedPaper = animated(Paper);

const Legend = (props) => {
  const {
    activeBubble,
    activeChoropleth,
    activeRegion,
    activeDateRange,
  } = useDashboardContext();

  const { data: summary } = useSummaryData();
  console.log({ summary });

  // prepare language
  const langKeys = [
    `METRIC_${activeBubble}`,
    `METRIC_${activeChoropleth}`,
    `REGION_${activeRegion}`,
  ];
  const [bubbleName, choroplethName, regionName] = useLang(langKeys);
  const summaryText = useLang("LEGEND_SUMMARY", {
    bubble: bubbleName,
    choropleth: choroplethName,
    region: regionName,
    start: activeDateRange[0],
    end: activeDateRange[1],
  });

  // move legend if panel is open
  const activePanel = useDashboardStore((state) => state.activePanel);
  const style = useSpring({ x: activePanel ? 344 : 0 });
  return (
    <AnimatedPaper style={style} {...props}>
      <Typography>{summaryText}</Typography>
      <PanelToggle />
    </AnimatedPaper>
  );
};

Legend.propTypes = {};

export default withStyles(styles)(Legend);
