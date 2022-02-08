import React from "react";
import clsx from "clsx";
import { withStyles } from "@material-ui/styles";
import { ArrowDownward, ArrowUpward } from "@material-ui/icons";
import { alpha, Box } from "@material-ui/core";

const styles = (theme) => ({
  root: {
    padding: theme.spacing(0.5),
    fontSize: theme.typography.pxToRem(12),
    fontFamily: theme.typography.fontFamily,
    marginRight: theme.spacing(1),
    marginLeft: "auto",
    borderRadius: 2,
  },
  icon: {
    marginRight: 4,
    fontSize: 12,
  },
  decrease: {
    backgroundColor: alpha(theme.palette.success.light, 0.2),
    color: theme.palette.success.dark,
  },
  increase: {
    backgroundColor: alpha(theme.palette.error.light, 0.2),
    color: theme.palette.error.dark,
  },
  neutral: {
    backgroundColor: theme.palette.grey[200],
    color: theme.palette.grey[800],
  },
});

/** Null component */
const Null = () => null;

/**
 * Displays a difference value along with colors and an icon indicating
 * whether the value is increasing or decreasing.
 */
const StatDiff = ({ classes, className, value, ...props }) => {
  const increase = value > 0;
  const decrease = value < 0;
  const neutral = value === 0;
  const Icon = increase ? ArrowUpward : decrease ? ArrowDownward : Null;
  return (
    <Box
      className={clsx(
        "HypStatDiff-root",
        classes.root,
        {
          [classes.increase]: increase,
          "HypStatDiff-increase": increase,
          [classes.decrease]: decrease,
          "HypStatDiff-decrease": decrease,
          [classes.neutral]: neutral,
          "HypStatDiff-neutral": neutral,
        },
        className
      )}
      display="flex"
      alignItems="center"
      {...props}
    >
      <Icon className={clsx("HypStatDiff-icon", classes.icon)} />
      {Math.abs(value)}
    </Box>
  );
};

StatDiff.propTypes = {};

export default withStyles(styles, { name: "HypStatDiff" })(StatDiff);
