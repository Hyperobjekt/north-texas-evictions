import React from "react";
import TimeSeriesChart from "../../TimeSeries/components/TimeSeriesChart";
import { Box } from "@material-ui/core";

const xAccessor = (d) => d?.date;
// TODO: swap out with common year
// const xAccessor = (d) => d && new Date(`${d["date"]}T00:00:00`);
const yAccessor = (d) => d?.value;
const xTooltipFormatter = (d) => "tooltip x value";
const yFormatter = (d) => d?.toFixed(2);

const TimeComparisonChart = ({ lines = [], ...props }) => {
  return (
    <Box width="100%" height={400} {...props}>
      <TimeSeriesChart
        xAccessor={xAccessor}
        yAccessor={yAccessor}
        yFormatter={yFormatter}
        xTooltipFormatter={xTooltipFormatter}
        lines={lines}
      >
        <line x1="0" y1="0" x2="100%" y2="0" stroke="black" strokeWidth="1" />
      </TimeSeriesChart>
    </Box>
  );
};

TimeComparisonChart.propTypes = {};

export default TimeComparisonChart;
