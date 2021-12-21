import { Box, withStyles } from "@material-ui/core";
import React from "react";

const StyledBox = withStyles({
  root: {
    position: "relative",
    // display: "flex",
    width: "100%",
    flex: 1,
  },
})(Box);

/**
 * Body of the dashboard, puts mouse coordinates into the data store
 * for hover effects (like tooltip)
 * @param {*} param0
 * @returns
 */
const Body = ({ children, ...props }) => {
  return <StyledBox {...props}>{children}</StyledBox>;
};

export default Body;
