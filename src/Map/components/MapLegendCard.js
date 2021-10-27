import React from "react";
import { Box, Typography } from "@material-ui/core";
import { useLang } from "../../Language";
import { BubbleLegend, ChoroplethLegend } from "../../Legend";
import { Stack } from "@hyperobjekt/material-ui-website";
import {
  Card,
  useDashboardChoropleth,
  useDashboardBubble,
} from "../../Dashboard";

export const MapLegend = ({ classes, ...props }) => {
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
      wrap={false}
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

const MapLegendCard = (props) => {
  return (
    <Card title="Map Legend" {...props}>
      <MapLegend />
    </Card>
  );
};

export default MapLegendCard;
