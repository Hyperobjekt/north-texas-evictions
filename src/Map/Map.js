import React from "react";
import { alpha, withStyles } from "@material-ui/core";
import { Mapbox } from "@hyperobjekt/mapbox";
import useMapLayers from "./hooks/useMapLayers";
import useMapSources from "./hooks/useMapSources";
import { NavigationControl } from "react-map-gl";
import FitBoundsControl from "./components/FitBoundsControl";
import { Stack } from "@hyperobjekt/material-ui-website";
import clsx from "clsx";
import { FOCUS_STATE } from "../theme";
import { AspectRatio } from "@material-ui/icons";
import useFlyOnLoad from "./hooks/useFlyOnLoad";
import MapTitle from "./components/MapTitle";

const styles = (theme) => ({
  root: {
    position: "absolute",
    inset: 0,
    zIndex: 1,
    "& .HypMapbox-map:before": {
      content: "''",
      inset: 0,
      position: "absolute",
      border: `4px solid transparent`,
      zIndex: 100,
      transition: theme.transitions.create(["border-color"]),
      pointerEvents: "none",
    },
    "& .HypMapbox-map:focus-within:before": {
      borderColor: alpha(theme.palette.secondary.main, 0.5),
    },
  },
  fitBoundsControl: {
    backgroundColor: theme.palette.background.paper,
    borderColor: theme.palette.divider,
    "& .MuiSvgIcon-root": {
      color: theme.palette.text.primary,
    },
    "&:hover": {
      backgroundColor: "#eee",
    },
  },
  navigationControl: {
    "& .mapboxgl-ctrl-group:not(:empty)": {
      boxShadow: "none",
      background: "transparent",
    },
    "& .mapboxgl-ctrl-group button+button": {
      marginTop: 4,
    },
    "& button.mapboxgl-ctrl-icon": {
      background: "#fff",
      border: `1px solid`,
      borderColor: theme.palette.divider,
      borderRadius: theme.shape.borderRadius,
      "&:focus:focus-visible, &:focus:not(:focus-visible)": {
        ...FOCUS_STATE,
        borderRadius: `${theme.shape.borderRadius}px!important`,
      },
      "&:not(:disabled):hover": {
        backgroundColor: "#eee",
      },
    },
  },
  controlStack: {
    position: "absolute",
    bottom: 24,
    right: 16,
    [theme.breakpoints.down("sm")]: {
      bottom: "auto",
      top: 104,
    },
  },
});

const Map = ({ classes, className, children, ...props }) => {
  // sources for the map based on current dashboard state
  const sources = useMapSources();
  // layers for the map based on the current dashboard state
  const layers = useMapLayers();
  // choropleth layers are the only interactive layers
  const interactiveLayers = layers
    .filter((l) => l.interactive)
    .map((l) => l.id);

  // trigger a fly to fit bounds on the map when data loads
  useFlyOnLoad();

  return (
    <Mapbox
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      mapStyle={process.env.REACT_APP_MAPBOX_STYLE}
      sources={sources}
      layers={layers}
      maxBounds={[
        [-98, 32],
        [-96, 34],
      ]}
      minZoom={7}
      interactiveLayerIds={interactiveLayers}
      className={clsx(classes.root, className)}
      onLoad={(map) => {
        // HACK: drop the tabindex attribute on the map wrapper (tabindex not needed, canvas has one)
        // TODO: move this to core component
        map?.target
          ?.getContainer()
          ?.parentNode?.parentNode?.removeAttribute("tabindex");
      }}
      {...props}
    >
      <MapTitle />
      <Stack direction="vertical" className={classes.controlStack}>
        <FitBoundsControl disableRipple className={classes.fitBoundsControl}>
          <AspectRatio style={{ fontSize: 20 }} />
        </FitBoundsControl>
        <NavigationControl
          className={classes.navigationControl}
          style={{ position: "relative" }}
          showCompass={false}
        />
      </Stack>
      {children}
    </Mapbox>
  );
};

export default withStyles(styles)(Map);
