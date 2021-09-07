import React from "react";
import { withStyles } from "@material-ui/core";
import { Mapbox } from "@hyperobjekt/mapbox";
import useMapLayers from "./hooks/useMapLayers";
import useMapSources from "./hooks/useMapSources";

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
      mapboxApiAccessToken="pk.eyJ1IjoidW50ZCIsImEiOiJja2gyYzVxanQwMzhoMnFxcjlxZnUwMHkzIn0.xKV8oPfM6BUJ9EcpGqAwVQ"
      sources={sources}
      layers={layers}
      maxBounds={[
        [-107.6, 33.8],
        [-65, 49.9],
      ]}
      minZoom={2}
      mapStyle="mapbox://styles/untd/cktapb92z086e17qvsxdkzvyf"
      interactiveLayerIds={interactiveLayers}
      {...props}
    />
  );
};

export default withStyles(styles)(Map);
