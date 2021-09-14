import React, { useRef } from "react";
import { withStyles } from "@material-ui/core";
import { Mapbox } from "@hyperobjekt/mapbox";
import useMapLayers from "./hooks/useMapLayers";
import useMapSources from "./hooks/useMapSources";
import { NavigationControl } from "react-map-gl";
import FitBoundsControl from "./components/FitBoundsControl";
import { Stack } from "@hyperobjekt/material-ui-website";
import clsx from "clsx";
import { FOCUS_STATE } from "../theme";
import { AspectRatio } from "@material-ui/icons";
import useFlyToFitBounds from "./hooks/useFlyToFitBounds";
import useDashboardStore from "../Dashboard/hooks/useDashboardStore";
import { parseRoute } from "../App/router";

const styles = (theme) => ({
  root: {
    position: "relative",
    width: "100%",
    height: "100%",
    zIndex: 1,
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

  // zoom to region bounds if no viewport set in the URL
  const hasZoomed = useRef(false);
  const flyToBounds = useFlyToFitBounds();
  const defaultViewport = useDashboardStore((state) => state.defaultViewport);
  if (sources.length > 0 && !hasZoomed.current) {
    hasZoomed.current = true;
    const { zoom, latitude, longitude } = parseRoute(
      undefined,
      window.location.hash
    );
    // fly to bounds if map has loaded with default viewport
    zoom === defaultViewport.zoom &&
      latitude === defaultViewport.latitude &&
      longitude === defaultViewport.longitude &&
      flyToBounds();
  }

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
      {...props}
    >
      <Stack
        direction="vertical"
        style={{ position: "absolute", bottom: 24, right: 16 }}
      >
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
