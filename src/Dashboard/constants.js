// indentifiers for layers corresponding to each region
export const REGION_LAYERS = [`choropleth`, `bubble`];

// fallbacks for choropleth / bubbles that are secified in the config
export const DEFAULT_CHOROPLETH_COLORS = ["#f0f7f9", "#a5d5db", "#008097"];
export const DEFAULT_BUBBLE_COLOR = "#e98816";

export const EVICTION_DATA_ENDPOINT =
  "https://cnvdr1v7ki.execute-api.us-east-1.amazonaws.com";

// metrics to show in the tooltip (TODO: move to config props)
export const TOOLTIP_METRICS = ["ef", "efr", "mfa", "tfa"];
