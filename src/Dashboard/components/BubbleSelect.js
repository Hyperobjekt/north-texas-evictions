import React from "react";
import PropTypes from "prop-types";
import useDashboardStore from "../hooks/useDashboardStore";
import { TextField } from "@material-ui/core";
import { MenuItem } from "@material-ui/core";
import { useLang } from "../../Language";
import shallow from "zustand/shallow";

const BubbleSelect = (props) => {
  const [metrics, activeBubble, setActiveBubble] = useDashboardStore(
    (state) => [state.metrics, state.activeBubble, state.setActiveBubble],
    shallow
  );
  const bubbleMetrics = metrics.filter((m) => m.type === "bubble");
  const label = useLang(`SELECT_BUBBLE`);
  const metricLabels = useLang(
    bubbleMetrics.map((metric) => `METRIC_${metric.id}`)
  );
  const handleChange = (event) => {
    setActiveBubble(event.target.value);
  };
  const isReady = bubbleMetrics.length > 0 && activeBubble;
  return (
    isReady && (
      <TextField
        id="bubble-select"
        select
        label={label}
        value={activeBubble}
        onChange={handleChange}
        {...props}
      >
        {bubbleMetrics.map((metric, i) => (
          <MenuItem key={metric.id} value={metric.id}>
            {metricLabels[i]}
          </MenuItem>
        ))}
      </TextField>
    )
  );
};

BubbleSelect.propTypes = {};

export default BubbleSelect;
