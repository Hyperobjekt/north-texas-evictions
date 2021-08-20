import { useMemo } from "react";
import { getColorInterpolator, getPositionScale } from "@hyperobjekt/legend";
import {
  DEFAULT_BUBBLE_COLOR,
  DEFAULT_CHOROPLETH_COLORS,
  REGION_LAYERS,
} from "../../Dashboard/constants";
import useDashboardStore from "../../Dashboard/hooks/useDashboardStore";
import shallow from "zustand/shallow";
import { quantile } from "d3-array";
import useDataExtents from "../../Data/useDataExtents";

const getLinearRamp = (from, to, steps = 1) => {
  const fromInterpolator = getPositionScale("linear", [0, 1], from);
  const toInterpolator = getPositionScale("linear", [0, 1], to);
  const values = [];
  for (let i = 0; i <= steps; i++) {
    values.push(fromInterpolator(i / steps));
    values.push(toInterpolator(i / steps));
  }
  return values;
};

const getLinearColorRamp = (from, to, steps = 1) => {
  const fromInterpolator = getPositionScale("linear", [0, 1], from);
  const toInterpolator = getColorInterpolator(to);
  const values = [];
  for (let i = 0; i <= steps; i++) {
    values.push(fromInterpolator(i / steps));
    values.push(toInterpolator(i / steps));
  }
  return values;
};

/**
 * Returns a mapboxgl style object for choropleth layers
 */
const getChoroplethLayerStyle = ({
  activeChoropleth = "pcw",
  activeRegion = "tracts",
  extents = [0, 1],
  colors = DEFAULT_CHOROPLETH_COLORS,
}) => {
  const extent = extents && extents[activeChoropleth];
  if (!extent) return [];
  return [
    {
      id: `${activeRegion}-choropleth`,
      source: `${activeRegion}-choropleth`,
      type: "fill",
      paint: {
        "fill-color": [
          "interpolate",
          ["linear"],
          ["get", activeChoropleth],
          ...getLinearColorRamp(extent, colors),
        ],
        "fill-opacity": 0.9,
      },
      beforeId: "water",
      interactive: true,
    },
    {
      id: `${activeRegion}-outline`,
      source: `${activeRegion}-choropleth`,
      type: "line",
      paint: {
        "line-color": colors[colors.length - 1],
        "line-width": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          3,
          ["case", ["boolean", ["feature-state", "selected"], false], 3, 0.5],
        ],
      },
      beforeId: "road-label",
    },
  ];
};

/**
 * Returns a mapboxgl style object for bubble layers
 */
const getBubbleLayerStyle = ({
  activeRegion,
  activeBubble = "pop",
  extents,
}) => {
  const extent = extents && extents[activeBubble];
  if (!extent) return [];
  return [
    {
      id: `${activeRegion}-bubble`,
      source: `${activeRegion}-bubble`,
      type: "circle",
      paint: {
        "circle-radius": [
          "interpolate",
          ["linear"],
          ["zoom"],
          6,
          [
            "interpolate",
            ["linear"],
            ["get", activeBubble],
            ...getLinearRamp(
              [quantile(extent[2], 0.1), quantile(extent[2], 0.99)],
              [0, 8]
            ),
          ],
          20,
          [
            "interpolate",
            ["linear"],
            ["get", activeBubble],
            ...getLinearRamp(
              [quantile(extent[2], 0.01), quantile(extent[2], 0.99)],
              [4, 48]
            ),
          ],
        ],
        // Color circle by earthquake magnitude
        "circle-color": DEFAULT_BUBBLE_COLOR,
        "circle-opacity": ["case", ["has", activeBubble], 0.8, 0],
        "circle-stroke-color": [
          "case",
          ["has", activeBubble],
          "white",
          "transparent",
        ],
        "circle-stroke-width": 1,
      },
    },
  ];
};

const getLayerStyle = (layerId, context) => {
  switch (layerId) {
    case "bubble":
      return getBubbleLayerStyle(context);
    case "choropleth":
      return getChoroplethLayerStyle(context);
    default:
      throw new Error(`no getter for layerId: ${layerId}`);
  }
};

export default function useMapLayers() {
  // TODO: pull required props from store
  const [activeBubble, activeChoropleth, activeRegion] = useDashboardStore(
    (state) => [state.activeBubble, state.activeChoropleth, state.activeRegion],
    shallow
  );
  const extents = useDataExtents();
  return useMemo(() => {
    const layers = REGION_LAYERS.map((layerId) =>
      getLayerStyle(layerId, {
        activeBubble,
        activeChoropleth,
        activeRegion,
        extents,
      })
    ).filter(Boolean);
    return layers.flat();
  }, [activeBubble, activeChoropleth, activeRegion, extents]);
}
