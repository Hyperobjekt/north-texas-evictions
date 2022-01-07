import React from "react";
import { IconButton, Box, Button, ButtonGroup, Typography, withStyles } from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
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
      color: theme.palette.text.primary,
    },
    '&.Mui-disabled': {
      backgroundColor: '#E6E6E6',
      color: theme.palette.text.disabled,
    }
  },
  disabledButtonTip: {
    display: 'flex',
    color: '#875c45',
    backgroundColor: '#e5d6cd',
    borderRadius: '2px',
    alignItems: 'center',
    padding: '5px 0px 5px 10px',
  },
  closeTipButton: {
    color: '#875c45',
  }
});

const TimeComparisonToggle = ({
    disabledButtons,
    clickHandler,
    selected,
    children,
    classes,
    ...props
  }) => {

  const [tipsToShow, setShowDisabledTip] = React.useState(
    disabledButtons.map(disabled => {
      return {id: disabled.id, show: true}
    })
  );

  const closeTip = (id) => (e) => {
    const newDisabledTips = tipsToShow.map(tip => {
      return tip.id === id ? {...tip, show: false} : tip;
    })
    setShowDisabledTip(newDisabledTips);
  }

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
              disabled={disabledButtons?.find(disabled => disabled.id === child.id)?.id === child.id && disabledButtons?.find(disabled => disabled.id === child.id)?.disabled}
            >
              <Typography variant={'caption'}>
                {child.label}
              </Typography>
            </Button>
          )
        })}
      </ButtonGroup>
        {disabledButtons?.map(buttonDetails => {
          const showTip = tipsToShow.find(showTip => showTip.id === buttonDetails.id)
          return (
            <>
              {buttonDetails.disabled && showTip.show && (
                <Box className={classes.disabledButtonTip}>
                  <Typography>
                    {buttonDetails.tip}
                  </Typography>
                  <IconButton className={classes.closeTipButton} onClick={closeTip(buttonDetails.id)} aria-label="close tip" component="span">
                    <CloseIcon />
                  </IconButton>
                </Box>
              )}
            </>
          )
        })}
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
