import React from "react";
import { withStyles } from "@material-ui/core";

import useDashboardContext from "../../Dashboard/hooks/useDashboardContext";
import LegendRow from "./LegendRow";
import { useTooltipData } from "../../Tooltip";
import useDataExtents from "../../Data/useDataExtents";
import { Scale } from "@hyperobjekt/legend";
import { DEFAULT_CHOROPLETH_COLORS } from "../../Dashboard/constants";
import useFormatter from "../../Dashboard/hooks/useFormatter";

const styles = (theme) => ({
  root: {
    "& .domain, & .tick line": {
      stroke: theme.palette.divider,
    },
    "& .tick text": {
      fill: theme.palette.text.secondary,
      fontSize: theme.typography.pxToRem(12),
    },
    // TODO: expose the styling for scale marker in a better way
    "& [class*='ScaleMarker-label']": {
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.pxToRem(12),
      marginTop: 4,
    },
    "& [class*='ScaleMarker-marker']": {
      background: theme.palette.primary.main,
    },
  },
});

const ChoroplethLegend = (props) => {
  const tooltipData = useTooltipData();
  const { activeChoropleth } = useDashboardContext();
  const extents = useDataExtents();
  const width = 200;
  const activeValue = tooltipData && tooltipData[activeChoropleth];
  const margin = { left: 24, right: 16, top: 0, bottom: 2 };
  const formatter = useFormatter(activeChoropleth, {
    short: true,
  });
  if (!extents || !extents[activeChoropleth]) return null;
  return (
    <LegendRow {...props}>
      <Scale
        type="continuous"
        width={width}
        margin={margin}
        data={extents[activeChoropleth][2]}
        colors={DEFAULT_CHOROPLETH_COLORS}
      >
        <Scale.Marker
          value={activeValue}
          label={!isNaN(activeValue) && formatter(activeValue)}
        />
        <Scale.Colors height={16} />
        <Scale.Ticks
          tickValues={[
            extents[activeChoropleth][0],
            extents[activeChoropleth][1],
          ]}
          height={32}
          tickFormat={formatter}
        />
      </Scale>
    </LegendRow>
  );
};

ChoroplethLegend.propTypes = {};

export default withStyles(styles)(ChoroplethLegend);