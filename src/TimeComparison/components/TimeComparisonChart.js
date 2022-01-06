import React from "react";
import TimeSeriesChart from "../../TimeSeries/components/TimeSeriesChart";
import { Box, Typography, Paper, withStyles } from "@material-ui/core";
import { Stack } from "@hyperobjekt/material-ui-website";
import { parseDate, Stat } from "../../Dashboard";
import PropTypes from "prop-types";

// TODO: swap out with common year
// const xAccessor = (d) => d && new Date(`${d["date"]}T00:00:00`);
//const xTooltipFormatter = (d) => "tooltip x value";

export const styles = (theme) => ({
  box: {
    marginTop: '0px !important',
  },
});

const TimeComparisonChart = ({ 
  lines = [], 
  view,
  compareToYear,
  xAccessor, 
  yAccessor, 
  yFormatter,
  xTooltipFormatter,
  xTickFormatter,
  yTickFormatter,
  classes,
  ...props 
}) => {
  //need slightly modified tooltip for comparison chart vs time series
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
            ((view === 'count') || (compareToYear !== datum.name && view === 'relative')) && (
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
    <Box 
      className={classes.box}
      width="100%"
      height={400}
      {...props}
    >
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
      </TimeSeriesChart>
    </Box>
  );
};

TimeComparisonChart.propTypes = {
  lines: PropTypes.arrayOf(PropTypes.shape({
    color: PropTypes.string,
    dashArray: PropTypes.string,
    id: PropTypes.string,
    visible: PropTypes.bool,
    data: PropTypes.arrayOf(PropTypes.shape({
      date: PropTypes.string,
      ef: PropTypes.number,
      name: PropTypes.string,
    })),
  })),
  compareToYear: PropTypes.string,
  xAccessor: PropTypes.func,
  yAccessor: PropTypes.func,
  yFormatter: PropTypes.func,
  xTooltipFormatter: PropTypes.func,
  xTickFormatter: PropTypes.func,
  yTickFormatter: PropTypes.func,
  classes: PropTypes.object,
};

export default withStyles(styles)(TimeComparisonChart);
