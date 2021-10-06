import React from "react";
import { Box, Typography, Tooltip } from "@material-ui/core";
import { InfoOutlined } from "@material-ui/icons";

/**
 * Helper component for rendering tooltip stats
 */
const Stat = ({
  label,
  value,
  valueColor = "textPrimary",
  labelColor = "textSecondary",
  hint,
  ...props
}) => {
  const inner = (
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
        {label}{" "}
        {hint && (
          <InfoOutlined
            style={{ fontSize: 12, position: "relative", top: 2 }}
            aria-hidden="true"
          />
        )}
      </Typography>
      <Typography component="span" variant="h2" color={valueColor}>
        {value}
      </Typography>
    </Box>
  );
  return hint ? (
    <Tooltip title={hint} arrow placement="left">
      {inner}
    </Tooltip>
  ) : (
    inner
  );
};

export default Stat;
