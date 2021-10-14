import React from "react";
import {
  AnimatedAxis,
  AnimatedGrid,
  AnimatedLineSeries,
  XYChart,
  buildChartTheme,
} from "@visx/xychart";
import { withParentSize } from "@visx/responsive";
import { useTheme } from "@material-ui/core";
import useLocationColors from "../../Locations/hooks/useLocationColors";
import { useLocationStore } from "../../Locations";
import { useDashboardStore } from "../../Dashboard";
import useSummaryData from "../../Data/useSummaryData";
import { curveMonotoneX } from "d3-shape";
import useLocationSeries from "../../Locations/hooks/useLocationSeries";
import useTimeSeriesStore from "../hooks/useTimeSeriesStore";

const TimeSeriesChart = ({ x = "date", y = "ef" }) => {
  const theme = useTheme();
  const { data: summary, status } = useSummaryData();
  const dateRange = useDashboardStore((state) => state.activeDateRange);
  const accessors = {
    xAccessor: (d) => d && new Date(`${d[x]}T00:00:00`),
    yAccessor: (d) => d && d[y],
  };
  const showOverall = useTimeSeriesStore((state) => state.showOverall);

  const pinnedLocations = useLocationStore((state) => state.pinned);
  const pinnedColors = useLocationColors(pinnedLocations);
  const locationSeries = useLocationSeries(pinnedLocations, dateRange);
  const customTheme = buildChartTheme({
    color: pinnedColors,
    // xAxisLineStyles: { stroke: theme.palette.text.secondary },
    // xTickLineStyles: { stroke: theme.palette.text.secondary },
  });

  const ready = status === "success";

  return (
    <XYChart
      xScale={{ type: "time" }}
      yScale={{ type: "linear" }}
      theme={customTheme}
      // onPointerMove={handlePointerMove}
      // onPointerOut={handlePointerOut}
    >
      <AnimatedAxis
        orientation="bottom"
        strokeWidth={4}
        labelProps={{
          style: {
            fontSize: "14px",
            fontWeight: 300,
            color: theme.palette.text.secondary,
            fill: theme.palette.text.secondary,
          },
        }}
        tickLabelProps={() => ({
          style: {
            fontSize: "14px",
            fontWeight: 300,
            color: theme.palette.text.secondary,
            fill: theme.palette.text.secondary,
          },
        })}
      />
      <AnimatedAxis
        orientation="left"
        left={25}
        numTicks={5}
        labelOffset={5}
        hideAxisLine
        hideTicks
        label={"Filings"}
        labelProps={{
          style: {
            fontSize: "14px",
            fontWeight: 300,
            color: theme.palette.text.secondary,
            fill: theme.palette.text.secondary,
          },
          textAnchor: "middle",
        }}
        tickLabelProps={() => ({
          dx: 24,
          textAnchor: "end",
          verticalAnchor: "end",
          style: {
            fontSize: "14px",
            fontWeight: 300,
            color: theme.palette.text.secondary,
            fill: theme.palette.text.secondary,
          },
        })}
      />
      <AnimatedGrid columns={false} numTicks={5} stroke="rgba(0,0,0,0.08)" />
      <AnimatedLineSeries
        dataKey="all"
        stroke="#f00"
        data={showOverall && ready ? summary.series : []}
        curve={curveMonotoneX}
        {...accessors}
      />

      {locationSeries.map(({ data, isSuccess }, i) => {
        if (!isSuccess) return null;
        return (
          <AnimatedLineSeries
            key={data.id}
            dataKey={data.id}
            stroke={pinnedColors[i]}
            data={data.series}
            curve={curveMonotoneX}
            {...accessors}
          />
        );
      })}
    </XYChart>
  );
};

export default withParentSize(TimeSeriesChart);
