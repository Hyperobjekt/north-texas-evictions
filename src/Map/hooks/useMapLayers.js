import { useMemo } from "react";
import { getColorInterpolator, getPositionScale } from "@hyperobjekt/legend";
import {
  DEFAULT_BUBBLE_COLOR,
  DEFAULT_CHOROPLETH_COLORS,
} from "../../Dashboard/constants";
import useDashboardStore from "../../Dashboard/hooks/useDashboardStore";
import shallow from "zustand/shallow";
import useDataExtents from "../../Data/useDataExtents";
import { getScales } from "@hyperobjekt/legend/lib/Scales/utils";

const getLinearRamp = (from, to, steps = 1) => {
  // adjust from extent if values are equal
  if (from && from[0] === from[1]) from = [0, from[1]];
  if (from[0] === from[1]) from = [0, 1];
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

const getStepsFromChunks = (chunks) => {
  const steps = [];
  chunks.forEach((chunk, i) => {
    if (i === 0) steps.push(chunk.color);
    steps.push(chunk.value[0]);
    steps.push(chunk.color);
  });
  return steps;
};

/**
 * Returns a mapboxgl style object for choropleth layers
 */
const getChoroplethLayerStyle = (
  {
    activeChoropleth = "pcw",
    activeRegion = "tracts",
    extents = [0, 1],
    colors = DEFAULT_CHOROPLETH_COLORS,
    scales,
  },
  options
) => {
  const extent = extents && extents[activeChoropleth];
  const hasSteps = scales.chunks;
  const steps = hasSteps
    ? getStepsFromChunks(scales.chunks)
    : getLinearColorRamp(extent, colors);
  const fillRule = hasSteps
    ? ["step", ["get", activeChoropleth], ...steps]
    : ["interpolate", ["linear"], ["get", activeChoropleth], ...steps];
  const colorArray = scales.color.range();
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
          fillRule,
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
        "line-color": colorArray[colorArray.length - 1], // use the darkest color on the scale for borders
        "line-width": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          3,
          ["case", ["boolean", ["feature-state", "selected"], false], 0.5, 0.5],
        ],
        "line-opacity": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          1,
          ["case", ["boolean", ["feature-state", "selected"], false], 0.1, 0.1],
        ],
      },
      beforeId: "road-label-simple",
    },
  ];
};

/**
 * Returns a mapboxgl style object for bubble layers
 */
const getBubbleLayerStyle = (
  { activeRegion, activeBubble = "pop", extents },
  options
) => {
  const extent = extents && extents[activeBubble];
  if (!extent) return [];
  const scaleFactor = options?.scaleFactor || 1;
  const adjustSizeFactor = (v) => v * scaleFactor;
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
              ...getLinearRamp(
                [extent[0], extent[1]],
                [1, 8].map(adjustSizeFactor)
              ),
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
              ...getLinearRamp(
                [extent[0], extent[1]],
                [6, 48].map(adjustSizeFactor)
              ),
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

const getLayerStyle = (layerId, context, options) => {
  switch (layerId) {
    case "bubble":
      return getBubbleLayerStyle(context, options);
    case "choropleth":
      return getChoroplethLayerStyle(context, options);
    default:
      throw new Error(`no getter for layerId: ${layerId}`);
  }
};

export default function useMapLayers() {
  // TODO: pull required props from store
  const [activeBubble, activeChoropleth, activeRegion, metrics] =
    useDashboardStore(
      (state) => [
        state.activeBubble,
        state.activeChoropleth,
        state.activeRegion,
        state.metrics,
      ],
      shallow
    );
  const extents = useDataExtents();
  const regions = useDashboardStore((state) => state.regions);
  return useMemo(() => {
    const metricConfig = metrics.find((m) => m.id === activeChoropleth);
    const scaleType = metricConfig?.scale || "continuous";
    const scaleData = extents?.[activeChoropleth]?.[2] || [];
    const scaleOptions = metricConfig?.scaleOptions || {};
    const scaleColors = metricConfig?.colors || DEFAULT_CHOROPLETH_COLORS;
    const region = regions.find((r) => r.id === activeRegion);
    const context = {
      activeBubble,
      activeChoropleth,
      activeRegion,
      extents,
      colors: scaleColors,
      scales: getScales(scaleType, scaleData, scaleColors, scaleOptions),
      region,
    };
    const layers = region?.layers
      ?.map((layer) => getLayerStyle(layer.id, context, layer.options))
      .filter(Boolean)
      .flat();
    return layers;
  }, [activeBubble, activeChoropleth, activeRegion, extents, metrics, regions]);
}
