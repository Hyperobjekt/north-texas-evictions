import React from "react";
import PropTypes from "prop-types";
import { Box, Paper, Typography, withStyles } from "@material-ui/core";
import useDashboardStore from "../../Dashboard/hooks/useDashboardStore";
import { useLang } from "../../Language";
import useDashboardContext from "../../Dashboard/hooks/useDashboardContext";

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

const LegendRow = ({ classes, title, value }) => {
  return (
    <Box className={classes.root}>
      <Typography className={classes.title}>{title}</Typography>
      {value}
    </Box>
  );
};

LegendRow.propTypes = {};

export default withStyles(styles)(LegendRow);
