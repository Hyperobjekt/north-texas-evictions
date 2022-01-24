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
    marginTop: "0px !important",
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
  height,
  margin,
  ...props
}) => {
  const [currDate, setCurrDate] = React.useState("");
  //need slightly modified tooltip for comparison chart vs time series
  const tooltipRenderer = ({ tooltipData }) => {
    const entries = Object.values(tooltipData?.datumByKey ?? {}).sort(
      (a, b) => {
        return a.key - b.key;
      }
    );
    const currIndex = tooltipData?.datumByKey["guide"]?.index;
    setCurrDate(tooltipData?.datumByKey["guide"]?.datum.date);
    const showInTip = ({ datum, index }) => {
      return (
        //if the view is counts, don't show the guide or any lines without a value at the current index
        (view === "counts" && datum.name !== "guide" && index === currIndex) ||
        //if the view is relative, don't show line being compared to, the guide, or any lines without a value at the current index
        (compareToYear !== datum.name &&
          view === "relative" &&
          datum.name !== "guide" &&
          index === currIndex)
      );
    };
    return (
      <Paper elevation={2}>
        <Box clone p={2} pb={0} bt={"none"}>
          <Typography variant="h2">
            {xTooltipFormatter(parseDate(currDate))}
          </Typography>
        </Box>
        <Stack between="sm" direction="vertical" around="md">
          {entries.map(
            ({ key, datum, index }) =>
              showInTip({ datum, index }) && (
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
              )
          )}
        </Stack>
      </Paper>
    );
  };

  const glyphRenderer = ({ datum }) => {
    return datum.name === "guide" ||
      datum.date !== currDate ||
      (datum.name === compareToYear && view === "relative") ? (
      <></>
    ) : (
      <circle r={4} fill={datum.color} />
    );
  };

  return (
    <Box className={classes.box} width="100%" height={height} {...props}>
      <TimeSeriesChart
        margin={margin}
        height={height}
        tooltipRenderer={tooltipRenderer}
        glyphRenderer={glyphRenderer}
        xAccessor={xAccessor}
        yAccessor={yAccessor}
        yFormatter={yFormatter}
        xTickFormatter={xTickFormatter}
        yTickFormatter={yTickFormatter}
        xTooltipFormatter={xTooltipFormatter}
        lines={lines}
      />
    </Box>
  );
};

TimeComparisonChart.propTypes = {
  lines: PropTypes.arrayOf(
    PropTypes.shape({
      legendLabel: PropTypes.string,
      color: PropTypes.string,
      dashArray: PropTypes.string,
      id: PropTypes.string,
      visible: PropTypes.bool,
      data: PropTypes.arrayOf(
        PropTypes.shape({
          date: PropTypes.string,
          ef: PropTypes.number,
          name: PropTypes.string,
        })
      ),
    })
  ),
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
