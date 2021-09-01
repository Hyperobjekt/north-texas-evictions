import React from "react";
import { withStyles } from "@material-ui/core";
import { useTooltipData } from ".";

const styles = (theme) => ({
  root: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 101,
  },
});

const Tooltip = ({ classes, ...props }) => {
  const data = useTooltipData();
  return data ? (
    <pre className={classes.root} {...props}>
      {JSON.stringify(data, null, 2)}
    </pre>
  ) : null;
};

export default withStyles(styles)(Tooltip);
