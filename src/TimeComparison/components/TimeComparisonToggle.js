import React from "react";
import { Button, ButtonGroup, Typography, withStyles } from "@material-ui/core";
import clsx from "clsx";
import PropTypes from "prop-types";

const styles = (theme) => ({
  button: {
    padding: '5px 7px',
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
    disabledIds,
    clickHandler,
    selected,
    children,
    classes,
    ...props
  }) => {
  return (
    <ButtonGroup
      className={classes.buttonGroup}
    >
      {children.map((child, i) => {
        return (
          <Button
            key={i}
            className={clsx(classes.button, selected === child.id ? 'active' : 'inactive')}
            onClick={clickHandler(child.id)}
            disabled={disabledIds?.find(disabled => disabled.id === child.id)?.id === child.id && disabledIds?.find(disabled => disabled.id === child.id)?.disabled}
          >
            <Typography variant={'caption'}>
              {child.label}
            </Typography>
          </Button>
        )
      })}
    </ButtonGroup>
  )
};

TimeComparisonToggle.propTypes = {
  disableRelative: PropTypes.bool,
  clickHandler: PropTypes.func,
  view: PropTypes.string,
  children: PropTypes.array,
  classes: PropTypes.object
};

export default withStyles(styles)(TimeComparisonToggle);
