import React from "react";
import TimeSeriesChart from "../../TimeSeries/components/TimeSeriesChart";
import { Box, Typography, Paper } from "@material-ui/core";
import { Stack } from "@hyperobjekt/material-ui-website";
import { parseDate, Stat } from "../../Dashboard";

// TODO: swap out with common year
// const xAccessor = (d) => d && new Date(`${d["date"]}T00:00:00`);
//const xTooltipFormatter = (d) => "tooltip x value";


const TimeComparisonChart = ({ 
  lines = [], 
  compareToYear,
  xAccessor, 
  yAccessor, 
  yFormatter,
  xTooltipFormatter,
  xTickFormatter,
  yTickFormatter,
  ...props 
}) => {
  const tooltipRenderer = ({ tooltipData }) => {
    const entries = Object.values(tooltipData?.datumByKey ?? {}).sort(
      (a, b) => {
        return a.key - b.key;
      }
    );
    const nearest = tooltipData?.nearestDatum?.datum;
    return (
      <Paper elevation={2}>
        <Box clone p={2} pb={0} bt={'none'}>
          <Typography variant="h2">
            {xTooltipFormatter(parseDate(nearest.date))}
          </Typography>
        </Box>
        <Stack between="sm" direction="vertical" around="md">
          {entries.map(({ key, datum }) => (
            compareToYear !== datum.name && (
            <Stat
              key={key}
              label={datum.name}
              value={yFormatter(yAccessor(datum))}
              labelColor={datum.color}
              minWidth={200}
            >
              <svg
                width="8"
                height="8"
                style={{ marginLeft: "auto", marginRight: 8 }}
              >
                <circle r="4" cx="4" cy="4" fill={datum.color} />
              </svg>
            </Stat>
          )))}
        </Stack>
      </Paper>
    );
  };

  return (
    <Box width="100%" height={400} {...props}>
      <TimeSeriesChart
        tooltipRenderer={tooltipRenderer}
        xAccessor={xAccessor}
        yAccessor={yAccessor}
        yFormatter={yFormatter}
        xTickFormatter={xTickFormatter}
        yTickFormatter={yTickFormatter}
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
