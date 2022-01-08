import React from "react";
import clsx from "clsx";
import { Box, withStyles } from "@material-ui/core";
import { animated, useSpring, useTransition } from "react-spring";
import useMeasure from "react-use-measure";
import DataFlag from "./DataFlag";

const styles = (theme) => ({
  root: {
    marginBottom: "1rem",
    position: "sticky",
    top: 80,
    zIndex: 99,
  },
  empty: {
    marginBottom: "0rem",
  },
  container: {
    display: "flex",
    flexDirection: "column",

    "&:empty": {
      marginBottom: "0rem",
    },
    "& > * + *": {
      marginTop: theme.spacing(1),
    },
  },
  flag: {
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
});

const AnimatedBox = animated(Box);
const AnimatedDataFlag = animated(DataFlag);

const DataFlags = ({ classes, className, flags, ...props }) => {
  // state storage for dismissed messages
  const [dismissed, setDismissed] = React.useState([]);

  // filter out any messages that have already been dismissed
  const filteredFlags = flags.filter((flag) => dismissed.indexOf(flag) === -1);

  // get the bounding rect of the data flag so we can offset margin on dismiss
  const [ref, rect] = useMeasure();

  // transition height on flag container
  const style = useSpring({
    height: filteredFlags.length > 0 ? rect.height : 0,
  });

  const transitions = useTransition(filteredFlags, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0, immediate: true },
    delay: 0,
    sort: (a, b) => {
      if (filteredFlags.indexOf(a) > -1) return -1;
      if (filteredFlags.indexOf(b) > -1) return 1;
      return a - b;
    },
  });

  // adds the flag to the "dismissed" list for filtering
  const handleDismiss = (flag) => setDismissed([...dismissed, flag]);

  return (
    <AnimatedBox
      className={clsx(
        classes.root,
        { [classes.empty]: filteredFlags.length === 0 },
        className
      )}
      style={style}
      {...props}
    >
      <Box ref={ref} className={classes.container}>
        {transitions((flagStyle, flag) => (
          <AnimatedDataFlag
            key={flag}
            onDismiss={() => handleDismiss(flag)}
            style={flagStyle}
          >
            {flag}
          </AnimatedDataFlag>
        ))}
      </Box>
    </AnimatedBox>
  );
};

DataFlags.propTypes = {};

export default withStyles(styles)(DataFlags);
