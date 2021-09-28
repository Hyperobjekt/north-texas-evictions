import React from "react";
import { Box, Typography } from "@material-ui/core";

/**
 * Helper component for rendering tooltip stats
 */
const Stat = ({
  label,
  value,
  valueColor = "textPrimary",
  labelColor = "textSecondary",
  ...props
}) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      {...props}
    >
      <Typography
        style={{ maxWidth: "12em" }}
        component="span"
        variant="caption"
        color={labelColor}
      >
        {label}
      </Typography>
      <Typography component="span" variant="h2" color={valueColor}>
        {value}
      </Typography>
    </Box>
  );
};

export default Stat;
