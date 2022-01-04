import React from "react";
import { Button, ButtonGroup, Typography, withStyles } from "@material-ui/core";
import PropTypes from "prop-types";
import { CallMissedSharp } from "@material-ui/icons";

const styles = (theme) => ({
  buttonInactive: {
    color: theme.palette.text.secondary,
  },
  buttonActive: {
    color: theme.palette.primary.main,
  }
});

const TimeComparisonToggle = ({
    clickHandler,
    view,
    children,
    classes,
    ...props
  }) => {
  return (
    <ButtonGroup
      className={classes.buttonGroup}
    >
      <Button
        className={view === "count" ? classes.buttonActive : classes.buttonInactive}
        onClick={clickHandler("count")}
      >
        <Typography variant="p">
          {children[0]}
        </Typography>
      </Button>
      <Button
        className={view === "relative" ? classes.buttonActive : classes.buttonInactive}
        onClick={clickHandler("relative")}
      >
        <Typography variant="p">
          {children[1]}
        </Typography>
      </Button>
    </ButtonGroup>
  )
};

TimeComparisonToggle.propTypes = {};

export default withStyles(styles)(TimeComparisonToggle);
