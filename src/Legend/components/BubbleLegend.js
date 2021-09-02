import React from "react";
import { useTheme, withStyles } from "@material-ui/core";
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
        extent={extents[activeBubble]}
        lineLength={12}
        margin={[1, 48, 1, 1]}
        sizes={[8, 16, 24]}
        highlight={highlight}
        formatLabel={formatter}
        theme={{
          bubble: {
            fill: DEFAULT_BUBBLE_COLOR,
            stroke: "#fff",
            fillOpacity: 0.8,
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
            fill: theme.palette.primary.main,
          },
          highlightText: {
            fill: theme.palette.text.primary,
          },
          highlightLine: {
            stroke: theme.palette.primary.main,
          },
        }}
      />
    </LegendRow>
  );
};

BubbleLegend.propTypes = {};

export default withStyles(styles)(BubbleLegend);
