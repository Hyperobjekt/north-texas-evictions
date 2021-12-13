import React from "react";
import PropTypes from "prop-types";
import TimeSeriesChart from "../../TimeSeries/components/TimeSeriesChart";
import { Box } from "@material-ui/core";
import useComparisonLines from "../hooks/useComparisonLines";

const xAccessor = (d) => d.date;
const yAccessor = (d) => d.value;
const xTooltipFormatter = (d) => "tooltip x value";
const yFormatter = (d) => d.toFixed(2);

const TimeComparisonChart = ({ lines = [], ...props }) => {
  return (
    <Box width="100%" height={400} {...props}>
      <TimeSeriesChart
        xAccessor={xAccessor}
        yAccessor={yAccessor}
        yFormatter={yFormatter}
        xTooltipFormatter={xTooltipFormatter}
        lines={lines}
      />
    </Box>
  );
};

TimeComparisonChart.propTypes = {};

export default TimeComparisonChart;
