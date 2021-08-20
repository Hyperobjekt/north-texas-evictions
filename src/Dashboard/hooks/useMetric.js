const result = {
  id: "mhi", // metrics identifier
  label: "Median Household Income", // human readable label for metric
  colors: [], // array of colors or color identifier string
  scale: "continuous", // discrete, diverging, continuous, quantile, quantize, threshold, category
  extent: [], // min / max values
  values: [], // all values
  format: (value) => "$12,345", // formatter for normal length strings
  shortFormat: () => "$12k", // formatter for short strings
  colorScale: (value) => "#COLOR", // function to map values to color
  positionScale: (value) => 0.123, // function to map values to position 0 - 1 (where within the extent it falls)
};
