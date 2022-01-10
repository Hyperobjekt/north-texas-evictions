import React from "react";
import PropTypes from "prop-types";
import { Box, IconButton, Typography, withStyles } from "@material-ui/core";
import { Close } from "@material-ui/icons";

// wrapper box for flags
const FlagBox = withStyles((theme) => ({
  root: {
    padding: theme.spacing(1, 1, 1, 2),
    backgroundColor: "#EFE6E0",
    color: theme.palette.primary.dark,
    borderRadius: theme.shape.borderRadius,
    "& .MuiIconButton-root": {
      marginRight: theme.spacing(1),
      marginLeft: theme.spacing(3),
    },
    "& .MuiSvgIcon-root": {
      color: theme.palette.primary.dark,
    },
  },
}))(Box);

/**
 * Displays a warning flag based on a user selection
 */
const DataFlag = ({ onDismiss, children, ...props }) => {
  return (
    <FlagBox
      display="flex"
      alignItems="center"
      justifyContent="flex-end"
      {...props}
    >
      <Typography variant="caption">{children}</Typography>
      {onDismiss && (
        <IconButton size="small" onClick={onDismiss}>
          <Close aria-label="dismiss" />
        </IconButton>
      )}
    </FlagBox>
  );
};

DataFlag.propTypes = {
  onDismiss: PropTypes.func,
};

export default DataFlag;
