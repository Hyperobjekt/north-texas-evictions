import React from "react";
import { Box, Typography, withStyles } from "@material-ui/core";
import { useTooltipData } from "../../Tooltip";
import { Scale, useScaleContext } from "@hyperobjekt/legend";
import { DEFAULT_CHOROPLETH_COLORS } from "../../Dashboard/constants";
import { useLang } from "../../Language";
import { getAdjustedScaleOptions } from "../../Data/utils";
import { useDashboardChoropleth, useFormatter } from "../../Dashboard";
import { useDataExtents } from "../../Data";

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

const Ticks = (props) => {
  const { extent } = useScaleContext();
  return <Scale.Ticks tickValues={extent} {...props} />;
};

const ChoroplethLegend = (props) => {
  const tooltipData = useTooltipData();
  const [activeChoropleth, , choropleths] = useDashboardChoropleth();
  const choroplethConfig = choropleths.find((c) => c.id === activeChoropleth);
  const extents = useDataExtents();
  const scaleType = choroplethConfig?.scale || "continuous";
  const scaleColors = choroplethConfig?.colors || DEFAULT_CHOROPLETH_COLORS;
  const scaleOptions = getAdjustedScaleOptions(
    extents?.[activeChoropleth]?.[2],
    choroplethConfig?.scaleOptions || {}
  );
  const width = 144;
  const activeValue = tooltipData && tooltipData[activeChoropleth];
  const margin = { left: 16, right: 16, top: 0, bottom: 2 };
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
          colors={scaleColors}
          {...scaleOptions}
        >
          <Scale.Marker
            value={activeValue}
            label={
              Number.isFinite(activeValue) ? formatter(activeValue) : undefined
            }
            pointerColor="currentColor"
            style={{
              marginTop: 12,
              marginLeft: margin.left,
              marginRight: margin.right,
            }}
          />
          <Scale.Colors height={16} />
          <Ticks height={32} tickFormat={formatter} />
        </Scale>
      )}
    </Box>
  );
};

ChoroplethLegend.propTypes = {};

export default withStyles(styles)(ChoroplethLegend);
