import React from "react";
import { darken, lighten, useTheme, withStyles } from "@material-ui/core";
import useDashboardContext from "../../Dashboard/hooks/useDashboardContext";
import LegendRow from "./LegendRow";
import { useTooltipData } from "../../Tooltip";
import { BubbleScale } from "@hyperobjekt/legend";
import useDataExtents from "../../Data/useDataExtents";
import { DEFAULT_BUBBLE_COLOR } from "../../Dashboard/constants";
import useFormatter from "../../Dashboard/hooks/useFormatter";

const styles = (theme) => ({
  root: {},
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
    <LegendRow {...props}>
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
    </LegendRow>
  );
};

BubbleLegend.propTypes = {};

export default withStyles(styles)(BubbleLegend);
