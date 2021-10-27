import React, { useRef } from "react";
import { Divider, Paper, withStyles } from "@material-ui/core";
import { useTooltipData } from ".";
import clsx from "clsx";
import { TOOLTIP_METRICS } from "../Dashboard/constants";
import { useLang } from "../Language";
import { useFormatters } from "../Dashboard/hooks/useFormatter";
import { Stack } from "@hyperobjekt/material-ui-website";
import useDashboardStore from "../Dashboard/hooks/useDashboardStore";
import shallow from "zustand/shallow";
import { animated, useSpring } from "react-spring";
import { scaleLinear } from "@visx/scale";
import Stat from "../Dashboard/components/Stat";
import { LocationName } from "../Locations";

// tooltip dimensions (height is an estimate for offsets)
const TOOLTIP_WIDTH = 240;
const TOOLTIP_HEIGHT = 320;

const styles = (theme) => ({
  root: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 101,
    width: TOOLTIP_WIDTH,
    pointerEvents: "none",
  },
  label: {
    maxWidth: "8em",
    paddingRight: theme.spacing(2),
  },
});

/** Returns the color to use for the value (bubble + choropleth metrics are highlighted) */
const getValueColor = (metric, activeBubble, activeChoropleth) => {
  if (metric === activeBubble) return "primary";
  if (metric === activeChoropleth) return "secondary";
  return "textPrimary";
};

// create animated version of Paper for react-spring
const AnimatedPaper = animated(Paper);

// create a scale for offsetting the tooltip so it doesn't go off the screen
const offsetScale = scaleLinear()
  .domain([0, window.innerWidth])
  .range([0, -1 * TOOLTIP_WIDTH]);

/**
 * Returns a vertical offset for the tooltip if it is going to go off screen
 * TODO: tooltip height is set to 320. ideally, this should be dynamic
 * @param {*} y
 * @returns
 */
const getVerticalOffset = (y) => {
  if (y + TOOLTIP_HEIGHT >= window.innerHeight) return -1 * TOOLTIP_HEIGHT;
  return 0;
};

const Tooltip = ({ classes, yOffset = 0, xOffset = 0, ...props }) => {
  // retrieve required data for rendering the tooltip
  const data = useTooltipData();
  const hoverCoords = useDashboardStore((state) => state.hoverCoords);
  const [activeBubble, activeChoropleth] = useDashboardStore(
    (state) => [state.activeBubble, state.activeChoropleth],
    shallow
  );

  // animate position and opacity
  const style = useSpring({
    x: (hoverCoords[0] || 0) + offsetScale(hoverCoords[0]) + xOffset,
    y: (hoverCoords[1] || 0) + getVerticalOffset(hoverCoords[1]) + yOffset,
    opacity: data ? 1 : 0,
  });

  // first 2 metrics are bubble / choropleth, followed by any additional metrics
  const metricIds = [
    activeBubble,
    activeChoropleth,
    ...TOOLTIP_METRICS.filter(
      (id) => id !== activeBubble && id !== activeChoropleth
    ),
  ];

  // get labels for metrics
  const metricKeys = metricIds.map((m) => `METRIC_${m}`);
  const rowLabels = useLang(metricKeys);

  // get formatters for metrics
  const rowFormatters = useFormatters(metricIds);

  // keep a ref to the data so we can gracefully fade out tooltip
  const dataRef = useRef(null);
  if (data) dataRef.current = data;

  // don't render anything if no tooltip data has been set yet
  if (!dataRef.current) return null;

  const rowData = metricIds.map((m, i) => rowFormatters[i](dataRef.current[m]));

  return (
    <AnimatedPaper
      style={style}
      elevation={3}
      className={clsx(classes.root)}
      {...props}
    >
      <LocationName name={dataRef.current?.name} p={2} pb={1.5} />
      <Divider />
      {/* first, stack the bubble / choropleth metrics */}
      <Stack direction="vertical" between="sm" around="md" alignItems="stretch">
        {metricIds.slice(0, 2).map((id, i) => (
          <Stat
            key={i}
            label={rowLabels[i]}
            value={rowData[i]}
            labelColor="textPrimary"
            valueColor={getValueColor(id, activeBubble, activeChoropleth)}
          />
        ))}
      </Stack>
      <Divider />
      {/* stack the remaining metrics, account for the index offset by adding 2 */}
      <Stack direction="vertical" between="sm" around="md" alignItems="stretch">
        {metricIds.slice(2).map((id, i) => (
          <Stat key={i + 2} label={rowLabels[i + 2]} value={rowData[i + 2]} />
        ))}
      </Stack>
    </AnimatedPaper>
  );
};

export default withStyles(styles)(Tooltip);
