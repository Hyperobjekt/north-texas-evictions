import React from "react";
import { Button, ButtonGroup, Typography, withStyles } from "@material-ui/core";
import clsx from "clsx";
import PropTypes from "prop-types";
import { CallMissedSharp } from "@material-ui/icons";

const styles = (theme) => ({
  button: {
    padding: '5px 11px',
    '&.active': {
      backgroundColor: '#649BA6',
      color: 'white'
    },
    '&.inactive': {
      color: theme.palette.text.secondary,
    }
  },
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
        className={clsx(classes.button, view === "count" ? 'active' : 'inactive')}
        onClick={clickHandler("count")}
      >
        <Typography variant={'caption'}>
          {children[0]}
        </Typography>
      </Button>
      <Button
        className={clsx(classes.button, view === "relative" ? 'active' : 'inactive')}
        onClick={clickHandler("relative")}
      >
        <Typography variant={'caption'}>
          {children[1]}
        </Typography>
      </Button>
    </ButtonGroup>
  )
};

TimeComparisonToggle.propTypes = {};

export default withStyles(styles)(TimeComparisonToggle);
