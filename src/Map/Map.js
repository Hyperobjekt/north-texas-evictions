import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core";
import { Mapbox } from "@hyperobjekt/mapbox";
import useMapLayers from "./hooks/useMapLayers";
import useMapSources from "./hooks/useMapSources";

const DEFAULT_VIEWPORT = {
  zoom: 8,
  latitude: 32.74,
  longitude: -96.96,
};

const styles = (theme) => ({
  root: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 1,
  },
});

const Map = (props) => {
  // sources for the map based on current dashboard state
  const sources = useMapSources();
  // layers for the map based on the current dashboard state
  const layers = useMapLayers();
  // choropleth layers are the only interactive layers
  const interactiveLayers = layers
    .filter((l) => l.interactive)
    .map((l) => l.id);

  return (
    <Mapbox
      mapboxApiAccessToken="pk.eyJ1IjoiaHlwZXJvYmpla3QiLCJhIjoiY2pzZ3Bnd3piMGV6YTQzbjVqa3Z3dHQxZyJ9.rHobqsY_BjkNbqNQS4DNYw"
      sources={sources}
      layers={layers}
      defaultViewport={DEFAULT_VIEWPORT}
      maxBounds={[
        [-107.6, 33.8],
        [-65, 49.9],
      ]}
      minZoom={2}
      interactiveLayerIds={interactiveLayers}
      {...props}
    />
  );
};

Map.propTypes = {};

export default withStyles(styles)(Map);
