import React from "react";
import { useDashboardStore } from "..";
import { Map } from "../../Map";
import clsx from "clsx";
import { Box, withStyles } from "@material-ui/core";
import { TimeSeries } from "../../TimeSeries";

// styles for visual wrapper
const visualWrapperStyles = (theme) => ({
  root: {
    position: "sticky",
    width: "100%",
    zIndex: 1,
    // place between header and bottom of viewport
    top: 88,
    height: `calc(100vh - ${theme.spacing(14)}px)`,
    // header takes up more height on mobile
    [theme.breakpoints.down("sm")]: {
      position: "fixed",
      top: 112,
      height: `calc(100vh - ${theme.spacing(22)}px)`,
    },
  },
});

/**
 * Container element for all views, sets styles so it scrolls
 * with the page (sidebar).
 */
const VisualWrapperBox = withStyles(visualWrapperStyles)(Box);

// styles for view wrappers
const viewWrapperStyles = (theme) => ({
  root: {
    position: "absolute",
    inset: 0,
    zIndex: 1,
    borderRadius: 8,
    overflow: "hidden",
    background: "#fff",
    boxShadow: theme.shadows[1],
    maxHeight: `calc(100vh - ${theme.spacing(14)}px)`,
    // add an outline on the container
    "&:after": {
      content: "''",
      display: "block",
      position: "absolute",
      inset: 0,
      zIndex: 9999,
      border: "1px solid #e6e6e6",
      borderRadius: 8,
      pointerEvents: "none",
    },
  },
  active: {
    zIndex: 100,
  },
});

/**
 * Wrapper for the visual component.  Adds a frame and sets
 * required syles to show the view when it is active.
 * TODO: could improve by adding a spring transition between views
 *    if time permits.
 */
const ViewWrapperBox = withStyles(viewWrapperStyles)(
  ({ classes, className, active, ...props }) => (
    <Box
      className={clsx(classes.root, active && classes.active, className)}
      {...props}
    />
  )
);

/**
 * The container element for the visualization.  Determins which visual
 * to show based on the current dashboard state (`activeView`).
 */
const Visual = (props) => {
  const activeView = useDashboardStore((state) => state.activeView);
  return (
    <VisualWrapperBox {...props}>
      <ViewWrapperBox active={activeView === "map"}>
        <Map />
      </ViewWrapperBox>
      <ViewWrapperBox active={activeView === "series"}>
        <TimeSeries />
      </ViewWrapperBox>
    </VisualWrapperBox>
  );
};

export default Visual;
