import React from "react";
import { Box } from "@material-ui/core";
import TimeSeriesChart from "./components/TimeSeriesChart";
import TimeSeriesTitle from "./components/TimeSeriesTitle";
import { useDashboardStore } from "../Dashboard";
import useTimeSeriesLines from "./hooks/useTimeSeriesLines";
import useFormatter from "../Dashboard/hooks/useFormatter";

const xAccessor = (d) => d && new Date(`${d["date"]}T00:00:00`);

const TimeSeries = (props) => {
  // show y series based on the current eviction bubble metric
  const activeBubble = useDashboardStore((state) => state.activeBubble);
  const yAccessor = (d) => d && d[activeBubble];
  const yFormatter = useFormatter(activeBubble);

  // get the lines data
  const lines = useTimeSeriesLines();

  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      bottom={0}
      right={0}
      display="flex"
      alignItems="stretch"
      justifyContent="flex-start"
      flexDirection="column"
      maxHeight="100%"
      overflow="hidden"
      {...props}
    >
      <TimeSeriesTitle />
      <Box boxSizing="border-box" pl={3} flex={1} height={`calc(100% - 64px)`}>
        {/* <p>test</p> */}
        <TimeSeriesChart
          xAccessor={xAccessor}
          yAccessor={yAccessor}
          yFormatter={yFormatter}
          lines={lines}
        />
      </Box>
    </Box>
  );
};

TimeSeries.propTypes = {};

export default TimeSeries;
