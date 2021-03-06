import React from "react";
import { Box, darken, lighten, useTheme, withStyles } from "@material-ui/core";
import { useTooltipData } from "../../Tooltip";
import { BubbleScale } from "@hyperobjekt/legend";
import { DEFAULT_BUBBLE_COLOR } from "../../Dashboard/constants";
import { useDashboardContext, useFormatter } from "../../Dashboard";
import { useDataExtents } from "../../Data";

const styles = (theme) => ({
  root: {
    width: 96,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

const BubbleLegend = (props) => {
  const tooltipData = useTooltipData();
  const { activeBubble } = useDashboardContext();
  const extents = useDataExtents();
  const theme = useTheme();
  const highlight = tooltipData && tooltipData[activeBubble];
  const formatter = useFormatter(activeBubble, {
    short: true,
  });
  return (
    <Box {...props}>
      <BubbleScale
        extent={extents[activeBubble] && extents[activeBubble].slice(0, 2)}
        lineLength={12}
        margin={[1, 48, 1, 1]}
        sizes={[8, 16, 24]}
        highlight={highlight}
        formatLabel={formatter}
        theme={{
          bubble: {
            fill: lighten(DEFAULT_BUBBLE_COLOR, 0.2),
            stroke: "#fff",
            strokeWidth: 0.5,
          },
          line: {
            stroke: theme.palette.divider,
          },
          text: {
            fill: theme.palette.text.secondary,
            fontFamily: theme.typography.fontFamily,
            fontSize: theme.typography.pxToRem(12),
            transform: "translate(-4,0)",
          },
          highlightBubble: {
            fill: lighten(DEFAULT_BUBBLE_COLOR, 0.2),
            stroke: darken(theme.palette.primary.main, 0.1),
          },
          highlightText: {
            fill: theme.palette.text.primary,
          },
          highlightLine: {
            stroke: darken(theme.palette.primary.main, 0.1),
          },
        }}
      />
    </Box>
  );
};

BubbleLegend.propTypes = {};

export default withStyles(styles)(BubbleLegend);
