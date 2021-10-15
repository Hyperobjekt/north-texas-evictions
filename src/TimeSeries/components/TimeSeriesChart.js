import React from "react";
import {
  AnimatedAxis,
  AnimatedGrid,
  AnimatedLineSeries,
  XYChart,
} from "@visx/xychart";
import { withParentSize } from "@visx/responsive";
import { curveMonotoneX } from "d3-shape";

const TimeSeriesChart = ({ lines, xAccessor, yAccessor }) => {
  return (
    <XYChart
      xScale={{ type: "time" }}
      yScale={{ type: "linear" }}
      // theme={customTheme}
      // onPointerMove={handlePointerMove}
      // onPointerOut={handlePointerOut}
    >
      <AnimatedAxis orientation="bottom" strokeWidth={4} hideAxisLine />
      <AnimatedAxis
        orientation="left"
        left={48}
        numTicks={5}
        labelOffset={16}
        hideAxisLine
        hideTicks
      />
      <AnimatedGrid columns={false} numTicks={5} stroke="rgba(0,0,0,0.08)" />
      {lines.map(({ id, color, data, visible }) => {
        if (!visible) return null;
        return (
          <AnimatedLineSeries
            key={id}
            dataKey={id}
            stroke={color}
            data={data}
            curve={curveMonotoneX}
            xAccessor={xAccessor}
            yAccessor={yAccessor}
          />
        );
      })}
    </XYChart>
  );
};

TimeSeriesChart.defaultProps = {
  xAccessor: (d) => d.x,
  yAccessor: (d) => d.y,
};

export default withParentSize(TimeSeriesChart);
