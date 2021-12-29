import React from "react";
import TimeSeriesChart from "../../TimeSeries/components/TimeSeriesChart";
import { getXTooltipFormatter } from "../utils";
import { Box } from "@material-ui/core";

const xAccessor = (d) => d && new Date(`${d["date"]}T00:00:00`)
// TODO: swap out with common year
// const xAccessor = (d) => d && new Date(`${d["date"]}T00:00:00`);
const yAccessor = (d) => d?.value;
//const xTooltipFormatter = (d) => "tooltip x value";
const xTooltipFormatter = getXTooltipFormatter('monthly')
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
        type={'comparison'}
      >
        <line x1="0" y1="0" x2="100%" y2="0" stroke="black" strokeWidth="1" />
      </TimeSeriesChart>
    </Box>
  );
};

TimeComparisonChart.propTypes = {};

export default TimeComparisonChart;
