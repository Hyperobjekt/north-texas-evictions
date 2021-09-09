import React from "react";
import useDataFlags from "../hooks/useDataFlags";
import {
  alpha,
  Box,
  IconButton,
  Typography,
  withStyles,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { animated, useSpring } from "react-spring";
import { useBoundingClientRect } from "@hyperobjekt/hooks";

const styles = (theme) => ({
  root: {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.dark,
    margin: `0 -0.5rem -0.5rem`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1, 1, 1, 2),
    "& .MuiIconButton-root": {
      marginRight: theme.spacing(1),
      marginLeft: theme.spacing(3),
    },
    "& .MuiSvgIcon-root": {
      color: theme.palette.primary.dark,
    },
  },
});

const AnimatedBox = animated(Box);

const DataFlags = (props) => {
  // state storage for dismissed messages
  const [dismissed, setDismissed] = React.useState([]);

  // pull flags based on current data options
  const flagText = useDataFlags();

  // filter out any messages that have already been dismissed
  const filteredFlagText = dismissed.reduce((str, current) => {
    return str.replace(current, "");
  }, flagText);

  // get the bounding rect of the data flag so we can offset margin on dismiss
  const [ref, rect] = useBoundingClientRect();

  // smooth transition when dismissing
  const style = useSpring({
    opacity: filteredFlagText ? 1 : 0,
    marginBottom: filteredFlagText ? -8 : -1 * rect.height,
    y: filteredFlagText ? 0 : -16,
  });

  // adds the flag to the "dismissed" list for filtering
  const handleDismiss = () => setDismissed([...dismissed, filteredFlagText]);

  return (
    <AnimatedBox
      ref={ref}
      style={style}
      display="flex"
      alignItems="center"
      justifyContent="flex-end"
      {...props}
    >
      <Typography variant="caption">{filteredFlagText || flagText}</Typography>
      <IconButton size="small" onClick={handleDismiss}>
        <Close />
      </IconButton>
    </AnimatedBox>
  );
};

DataFlags.propTypes = {};

export default withStyles(styles)(DataFlags);
