import React from "react";
import PropTypes from "prop-types";
import useDashboardStore from "../hooks/useDashboardStore";
import { TextField } from "@material-ui/core";
import { MenuItem } from "@material-ui/core";
import { useLang } from "../../Language";
import shallow from "zustand/shallow";

const ChoroplethSelect = (props) => {
  const [metrics, activeChoropleth, setActiveChoropleth] = useDashboardStore(
    (state) => [
      state.metrics,
      state.activeChoropleth,
      state.setActiveChoropleth,
    ],
    shallow
  );
  const choroplethMetrics = metrics.filter(
    (metric) => metric.type === "choropleth"
  );
  const label = useLang(`SELECT_CHOROPLETH`);
  const metricLabels = useLang(
    choroplethMetrics.map((metric) => `METRIC_${metric.id}`)
  );
  const handleChange = (event) => {
    setActiveChoropleth(event.target.value);
  };
  const isReady = choroplethMetrics.length > 0 && activeChoropleth;
  return (
    isReady && (
      <TextField
        id="choropleth-select"
        select
        label={label}
        value={activeChoropleth}
        onChange={handleChange}
        {...props}
      >
        {choroplethMetrics.map((metric, i) => (
          <MenuItem key={metric.id} value={metric.id}>
            {metricLabels[i]}
          </MenuItem>
        ))}
      </TextField>
    )
  );
};

ChoroplethSelect.propTypes = {};

export default ChoroplethSelect;
