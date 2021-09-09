import React from "react";
import { Box, Tooltip, Typography, withStyles } from "@material-ui/core";
import clsx from "clsx";
import { InfoOutlined } from "@material-ui/icons";

const styles = (theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 0,
    flex: 1,
    minHeight: 20,
  },
});

const LegendRow = ({ classes, className, title, hint, children, ...props }) => {
  const inner = (
    <Box className={clsx(classes.root, className)} {...props}>
      <Typography variant="caption" color="textSecondary">
        {title}{" "}
        {hint && (
          <InfoOutlined
            style={{ fontSize: 12, position: "relative", top: 2 }}
            aria-hidden="true"
          />
        )}
      </Typography>
      {children}
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

LegendRow.propTypes = {};

export default withStyles(styles)(LegendRow);
