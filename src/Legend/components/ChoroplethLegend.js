import React from "react";
import { Box, Typography, withStyles } from "@material-ui/core";
import { useTooltipData } from "../../Tooltip";
import useDataExtents from "../../Data/useDataExtents";
import { Scale } from "@hyperobjekt/legend";
import { DEFAULT_CHOROPLETH_COLORS } from "../../Dashboard/constants";
import useFormatter from "../../Dashboard/hooks/useFormatter";
import { useLang } from "../../Language";
import useDashboardChoropleth from "../../Dashboard/hooks/useDashboardChoropleth";

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
  const [activeChoropleth, , choropleths] = useDashboardChoropleth();
  const choroplethConfig = choropleths.find((c) => c.id === activeChoropleth);
  const scaleType = choroplethConfig?.scale || "continuous";
  const scaleOptions = choroplethConfig?.scaleOptions || {};
  const extents = useDataExtents();
  const width = 188;
  const activeValue = tooltipData && tooltipData[activeChoropleth];
  const margin = { left: 24, right: 16, top: 0, bottom: 2 };
  const formatter = useFormatter(activeChoropleth, {
    short: true,
  });
  const unavailable = useLang("LABEL_UNAVAILABLE");
  const isUnavailable =
    !extents[activeChoropleth] ||
    !Number.isFinite(extents[activeChoropleth][0]) ||
    !Number.isFinite(extents[activeChoropleth][1]);
  return (
    <Box {...props}>
      {isUnavailable ? (
        <Typography
          variant="caption"
          color="textSecondary"
          style={{ margin: "0 auto" }}
        >
          {unavailable}
        </Typography>
      ) : (
        <Scale
          type={scaleType}
          width={width}
          margin={margin}
          data={extents[activeChoropleth][2]}
          colors={DEFAULT_CHOROPLETH_COLORS}
          {...scaleOptions}
        >
          <Scale.Marker
            value={activeValue}
            label={
              Number.isFinite(activeValue) ? formatter(activeValue) : undefined
            }
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
      )}
    </Box>
  );
};

ChoroplethLegend.propTypes = {};

export default withStyles(styles)(ChoroplethLegend);
