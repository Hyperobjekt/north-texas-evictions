import { useMemo } from "react";
import { getColorInterpolator, getPositionScale } from "@hyperobjekt/legend";
import {
  DEFAULT_BUBBLE_COLOR,
  DEFAULT_CHOROPLETH_COLORS,
  REGION_LAYERS,
} from "../../Dashboard/constants";
import useDashboardStore from "../../Dashboard/hooks/useDashboardStore";
import shallow from "zustand/shallow";
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
  if (!from || !from[0] || !from[1]) from = [0, 1];
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
  // const isUnavailable = !extent || !extent[0] || !extent[1];
  return [
    {
      id: `${activeRegion}-choropleth`,
      source: `${activeRegion}-choropleth`,
      type: "fill",
      paint: {
        "fill-color": [
          "case",
          ["!=", ["get", activeChoropleth], null],
          [
            "interpolate",
            ["linear"],
            ["get", activeChoropleth],
            ...getLinearColorRamp(extent, colors),
          ],
          "#ccc",
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
        "line-opacity": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          1,
          ["case", ["boolean", ["feature-state", "selected"], false], 1, 0.1],
        ],
      },
      beforeId: "road-label-simple",
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
      beforeId: "road-label-simple",
      paint: {
        "circle-radius": [
          "interpolate",
          ["linear"],
          ["zoom"],
          6,
          [
            "case",
            ["!=", ["get", activeBubble], null],
            [
              "interpolate",
              ["linear"],
              ["get", activeBubble],
              ...getLinearRamp([extent[0], extent[1]], [0, 8]),
            ],
            1,
          ],
          20,
          [
            "case",
            ["!=", ["get", activeBubble], null],
            [
              "interpolate",
              ["linear"],
              ["get", activeBubble],
              ...getLinearRamp([extent[0], extent[1]], [6, 48]),
            ],
            6,
          ],
        ],
        // Color circle by earthquake magnitude
        "circle-color": [
          "case",
          ["!=", ["get", activeBubble], null],
          DEFAULT_BUBBLE_COLOR,
          "#ccc",
        ],
        "circle-opacity": ["case", ["!=", ["get", activeBubble], null], 0.8, 0],
        "circle-stroke-color": [
          "case",
          ["!=", ["get", activeBubble], null],
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
