// fallbacks for choropleth / bubbles that are secified in the config
export const DEFAULT_CHOROPLETH_COLORS = ["#f0f7f9", "#a5d5db", "#008097"];
export const DEFAULT_BUBBLE_COLOR = "#e98816";

// time series events colors
export const EVENT_COLORS = [
  "#F07300",
  "#666666",
  "#CE0000",
  "#ce0067",
  "#0000CE",
];

export const EVICTION_DATA_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

// metrics to show in the tooltip (TODO: move to config props)
export const TOOLTIP_METRICS = ["ef", "efr", "rhh", "mfa", "tfa"];

export const ALL_DATA_COLOR = "#ABC2C1";
