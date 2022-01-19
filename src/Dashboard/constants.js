// fallbacks for choropleth / bubbles that are specified in the config
export const DEFAULT_CHOROPLETH_COLORS = ["#f0f7f9", "#a5d5db", "#008097"];
export const DEFAULT_BUBBLE_COLOR = "#e98816";

export const TIME_COMPARISON_LINE_COLORS = [
  "#CCCCCC",
  "#9DC58F",
  "#A57A9F",
  "#8f9dc5",
  "#323232",
];

export const EVICTION_DATA_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

// metrics to show in the tooltip (TODO: move to config props)
export const TOOLTIP_METRICS = ["ef", "efr", "rhh", "mfa", "tfa"];

export const ALL_DATA_COLOR = "#ABC2C1";
