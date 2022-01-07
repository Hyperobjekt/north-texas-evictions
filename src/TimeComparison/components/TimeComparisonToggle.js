import React from "react";
import { Button, ButtonGroup, Typography, withStyles } from "@material-ui/core";
import clsx from "clsx";
import PropTypes from "prop-types";
import {DataFlags} from "../../Flags";

const styles = (theme) => ({
  button: {
    padding: '5px 7px',
    '&.active': {
      backgroundColor: '#649BA6',
      color: 'white'
    },
    '&.inactive': {
      color: theme.palette.text.primary,
    },
    '&.Mui-disabled': {
      backgroundColor: '#E6E6E6',
      color: theme.palette.text.disabled,
    }
  },
});

const TimeComparisonToggle = ({
    disableableButtons,
    clickHandler,
    selected,
    children,
    classes,
    ...props
  }) => {

  let tips = [];
  disableableButtons.forEach(buttonDetail => {
    if (buttonDetail.disabled) {tips.push(buttonDetail.tip)}
  })

  return (
    <>
      <ButtonGroup
        className={classes.buttonGroup}
      >
        {children.map((child, i) => {
          return (
            <Button
              key={i}
              className={clsx(classes.button, selected === child.id ? 'active' : 'inactive')}
              onClick={clickHandler(child.id)}
              disabled={disableableButtons?.find(disabled => disabled.id === child.id)?.id === child.id && disableableButtons?.find(disabled => disabled.id === child.id)?.disabled}
            >
              <Typography variant={'caption'}>
                {child.label}
              </Typography>
            </Button>
          )
        })}
      </ButtonGroup>
      <DataFlags flags={tips}/>
    </>
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
