import React, { useRef } from "react";
import { Box, Divider, Paper, Typography, withStyles } from "@material-ui/core";
import { useTooltipData } from ".";
import clsx from "clsx";
import { TOOLTIP_METRICS } from "../Dashboard/constants";
import { useLang } from "../Language";
import { useFormatters } from "../Dashboard/hooks/useFormatter";

const styles = (theme) => ({
  root: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 101,
  },
});

const METRIC_KEYS = TOOLTIP_METRICS.map((m) => `METRIC_${m}`);

const getTooltipTitle = (data) => {
  if (!data || !data.name) return ["Unavailable", ""];
  const [name, parent] = data.name.split(",");
  return [name, parent || "Texas"];
};

const Tooltip = ({ classes, ...props }) => {
  const data = useTooltipData();
  // keep a ref to the data so we can gracefull fade out tooltip
  const dataRef = useRef(null);
  const rowLabels = useLang(METRIC_KEYS);
  const rowFormatters = useFormatters(TOOLTIP_METRICS);
  // update the data reference when the data changes
  if (data) dataRef.current = data;

  if (!dataRef.current) return null;
  const [name, parent] = getTooltipTitle(dataRef.current);
  const rowData = TOOLTIP_METRICS.map((m, i) =>
    rowFormatters[i](dataRef.current[m])
  );
  return (
    <Paper className={clsx(classes.root)}>
      <Box p={2}>
        <Typography variant="body1">{name}</Typography>
        {parent && <Typography variant="body2">{parent}</Typography>}
      </Box>
      <Divider />
      {rowLabels.map((label, i) => (
        <Box
          display="flex"
          justifyContent="space-between"
          key={i}
          py={1}
          px={2}
        >
          <Typography variant="body2">{label}</Typography>
          <Typography variant="body2">{rowData[i]}</Typography>
        </Box>
      ))}
    </Paper>
  );
};

export default withStyles(styles)(Tooltip);
