import { Box, withStyles } from "@material-ui/core";
import React, { useCallback } from "react";
import useDashboardStore from "../../Dashboard/hooks/useDashboardStore";

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
  // track mouse coords for tooltip
  const setHoverCoords = useDashboardStore((state) => state.setHoverCoords);
  const handleMouseMove = useCallback(
    (e) => {
      setHoverCoords([e.clientX, e.clientY]);
    },
    [setHoverCoords]
  );

  return (
    <StyledBox onMouseMove={handleMouseMove} {...props}>
      {children}
    </StyledBox>
  );
};

export default Body;
