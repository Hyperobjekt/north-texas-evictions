import React from "react";
import { Box } from "@material-ui/core";
import TimeSeriesChart from "./components/TimeSeriesChart";

const TimeSeries = (props) => {
  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      bottom={0}
      right={0}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <TimeSeriesChart />
    </Box>
  );
};

TimeSeries.propTypes = {};

export default TimeSeries;
