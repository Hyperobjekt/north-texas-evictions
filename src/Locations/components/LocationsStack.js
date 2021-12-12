import React, { useCallback } from "react";
import useLocationStore from "../hooks/useLocationStore";
import shallow from "zustand/shallow";
import { Box, ButtonBase, IconButton, Tooltip } from "@material-ui/core";
import { useDashboardStore } from "../../Dashboard";
import { ArrowBack } from "@material-ui/icons";
import LocationPanel from "./LocationPanel";
import clsx from "clsx";
import { withStyles } from "@material-ui/styles";
import { animated, useSpring } from "react-spring";
import { HEADER_BACKGROUND_COLOR } from "../../theme";
import ExpandIcon from "../../Icons/ExpandIcon";

const Wrapper = withStyles((theme) => ({
  root: {
    position: "fixed",
    top: theme.spacing(8),
    bottom: 0,
    left: -368,
    width: "100%",
    pointerEvents: "none",
    maxHeight: `calc(100vh - ${theme.spacing(8)}px)`,
    zIndex: 100,
    overflow: "auto",
    backgroundColor: "transparent",
    transition: "all 0.2s ease",
    "&.expanded": {
      pointerEvents: "all",
      backgroundColor: "rgba(255,255,255,0.8)",
    },
    "&.collapsed": {
      left: 0,
    },
  },
}))(Box);

/**
 * Returns a function that toggles the location view on / off
 */
function useToggleLocations() {
  const [showLocations, setShowLocations, expandLocations, setExpandLocations] =
    useLocationStore(
      (state) => [
        state.showLocations,
        state.setShowLocations,
        state.expandLocations,
        state.setExpandLocations,
      ],
      shallow
    );
  // toggle the collapsed locations view
  return useCallback(() => {
    setShowLocations(!showLocations);
    expandLocations && setExpandLocations(false);
  }, [showLocations, setShowLocations, expandLocations, setExpandLocations]);
}

/**
 * Styled back button for header bar
 */
const BackButton = withStyles((theme) => ({
  root: {
    position: "fixed",
    justifyContent: "flex-start",
    fontSize: theme.typography.pxToRem(18),
    color: theme.palette.primary.main,
    padding: theme.spacing(0, 3),
    height: 64,
    top: 0,
    left: 0,
    width: "100%",
    backgroundColor: HEADER_BACKGROUND_COLOR,
    zIndex: 9999,
    pointerEvents: "all",
    "& .MuiSvgIcon-root": {
      marginRight: theme.spacing(1),
    },
    "&:focus,&:hover": {
      textDecoration: "underline",
    },
  },
}))(ButtonBase);

const AnimatedBackButton = animated(BackButton);

const CloseStackButton = ({ show, ...props }) => {
  const handleCloseLocations = useToggleLocations();

  const style = useSpring({
    y: show ? 0 : -64,
  });

  return (
    <AnimatedBackButton
      variant="text"
      style={style}
      onClick={handleCloseLocations}
    >
      <ArrowBack /> Back to Dashboard
    </AnimatedBackButton>
  );
};

/**
 * Button that toggles expanded / collapsed locations view
 */
const ToggleExpandButton = () => {
  const [locations, showLocations, expandLocations, setExpandLocations] =
    useLocationStore(
      (state) => [
        state.locations,
        state.showLocations,
        state.expandLocations,
        state.setExpandLocations,
      ],
      shallow
    );
  // toggle the expanded locations view
  const handleToggleExpand = () => setExpandLocations(!expandLocations);

  const tooltipText = expandLocations ? "Stack Locations" : "Compare Locations";

  const isHidden = !showLocations || locations.length < 2;

  return (
    <Tooltip title={tooltipText} arrow>
      <IconButton
        size="small"
        onClick={handleToggleExpand}
        style={{
          position: "absolute",
          top: 16,
          left: isHidden ? -32 : expandLocations ? 272 : 224,
          transition: "all 0.2s ease",
          zIndex: 10000,
          pointerEvents: "all",
        }}
      >
        <ExpandIcon
          style={{
            transition: "transform 0.4s ease",
            transform: expandLocations ? `rotate(180deg)` : `rotate(0deg)`,
          }}
        />
      </IconButton>
    </Tooltip>
  );
};

/**
 * Displays location cards in either a condensed stack or
 * a side-by-side comparison view
 */
const LocationsStack = ({ ...props }) => {
  const [locations, active, showLocations, expandLocations] = useLocationStore(
    (state) => [
      state.locations,
      state.active,
      state.showLocations,
      state.expandLocations,
    ],
    shallow
  );

  // locations currently in the stack
  const locationsStack = active
    ? [
        active,
        ...locations.filter((l) => l.properties.id !== active.properties.id),
      ]
    : locations;

  // current date range
  const activeDateRange = useDashboardStore((state) => state.activeDateRange);

  // remove a location from the pinned locations
  const handleDismissLocation = useToggleLocations();

  return (
    <>
      <CloseStackButton show={expandLocations} />
      <Wrapper
        className={clsx({
          expanded: expandLocations,
          collapsed: showLocations,
        })}
        {...props}
      >
        <ToggleExpandButton />
        {locationsStack.reverse().map((feature, i) => (
          <LocationPanel
            key={feature.properties.id}
            absolute={true}
            feature={feature}
            dateRange={activeDateRange}
            offset={
              (locations.length - 1 - i) *
              (expandLocations ? 320 : 8 / (locations.length - i) + 4)
            }
            syncScroll={expandLocations}
            open={true}
            style={{
              zIndex: 10 + locations.length + i,
              maxWidth: 320,
              pointerEvents: "all",
            }}
            onClose={!expandLocations && handleDismissLocation}
          />
        ))}
      </Wrapper>
    </>
  );
};

export default LocationsStack;
