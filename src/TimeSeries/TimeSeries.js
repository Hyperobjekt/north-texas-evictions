import React from "react";
import { Box } from "@material-ui/core";

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
      <p>time series</p>
    </Box>
  );
};

TimeSeries.propTypes = {};

export default TimeSeries;
