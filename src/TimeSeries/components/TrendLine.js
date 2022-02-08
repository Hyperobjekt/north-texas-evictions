import React from "react";
import { extent, max } from "d3-array";
import { LinePath } from "@visx/shape";
import { scaleTime, scaleLinear } from "@visx/scale";
import { curveMonotoneX } from "d3-shape";
import { parseDate } from "../../Dashboard";

// data accessors
const getX = (d) => parseDate(d.date);
const getY = (d) => Number(d.ef);

const TrendLine = ({
  data = [],
  width = 116,
  height = 24,
  color = "#EC7406",
  ...props
}) => {
  data = data.filter((d) => Number.isFinite(d.ef));
  const hasData = data.length > 0;
  // scales
  const xScale = scaleTime({
    domain: extent(data, getX),
  });
  const yScale = scaleLinear({
    domain: [0, max(data, getY)],
  });

  // update scale output ranges
  xScale.range([1, width]);
  yScale.range([height, 1]);

  // add some extra points for the filled shape
  const dataFilled = data.concat([
    { ...data[data.length - 1], ef: 0 },
    { ...data[0], ef: 0 },
  ]);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height + 2}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {hasData && (
        <LinePath
          data={dataFilled}
          x={(d) => xScale(getX(d)) ?? 0}
          y={(d) => yScale(getY(d)) ?? height}
          fill={color}
          opacity={0.3}
          shapeRendering="geometricPrecision"
          curve={curveMonotoneX}
        />
      )}
      {hasData && (
        <LinePath
          data={data}
          x={(d) => xScale(getX(d)) ?? 0}
          y={(d) => yScale(getY(d)) ?? height}
          stroke={color}
          strokeWidth={1}
          strokeOpacity={1}
          shapeRendering="geometricPrecision"
          curve={curveMonotoneX}
        />
      )}
    </svg>
  );
};

export default TrendLine;
