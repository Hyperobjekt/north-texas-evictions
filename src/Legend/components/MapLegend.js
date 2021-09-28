import React from "react";
import { Box, Typography } from "@material-ui/core";
import { useLang } from "../../Language";
import BubbleLegend from "./BubbleLegend";
import ChoroplethLegend from "./ChoroplethLegend";
import { Stack } from "@hyperobjekt/material-ui-website";
import useDashboardBubble from "../../Dashboard/hooks/useDashboardBubble";
import useDashboardChoropleth from "../../Dashboard/hooks/useDashboardChoropleth";

const MapLegend = ({ classes, ...props }) => {
  const [activeBubble] = useDashboardBubble();
  const [activeChoropleth] = useDashboardChoropleth();

  // prepare language
  const langKeys = [`METRIC_${activeBubble}`, `METRIC_${activeChoropleth}`];
  const [bubbleName, choroplethName] = useLang(langKeys);

  return (
    <Stack
      direction="horizontal"
      alignItems="flex-start"
      justifyContent="space-between"
      between="none"
    >
      <Box>
        <Typography variant="body2" gutterBottom align="center">
          {bubbleName}
        </Typography>
        <BubbleLegend />
      </Box>
      <Box>
        <Typography variant="body2" gutterBottom align="center">
          {choroplethName}
        </Typography>
        <ChoroplethLegend />
      </Box>
    </Stack>
  );
};

export default MapLegend;
