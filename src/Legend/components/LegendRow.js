import React from "react";
import { Box, Typography, withStyles } from "@material-ui/core";
import clsx from "clsx";

const styles = (theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: theme.spacing(2, 0, 0),
  },
  title: {
    color: theme.props.text.secondary,
    fontSize: theme.typography.pxToRem(12),
    lineHeight: theme.typography.pxToRem(16),
  },
});

const LegendRow = ({ classes, className, title, children, ...props }) => {
  return (
    <Box className={clsx(classes.root, className)} {...props}>
      <Typography className={classes.title}>{title}</Typography>
      {children}
    </Box>
  );
};

LegendRow.propTypes = {};

export default withStyles(styles)(LegendRow);
