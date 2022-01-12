import React, { useContext } from "react";
import PropTypes from "prop-types";
import { DataContext } from "@visx/xychart";
import { useDashboardDateRange } from "../../Dashboard";

/** Renders the events overlay on the time series chart */
const TimeSeriesEventsLayer = (props) => {
  const { xScale, margin } = useContext(DataContext);
  const [currentDateRange] = useDashboardDateRange(); // or xScale.domain() will give you date objects
  if (!xScale || !margin?.top) return null;
  const startDate = "2021-04-01";
  const endDate = "2021-05-01";
  const startX = xScale(new Date(startDate)); // use max of startDate and currentDateRange[0]
  const endX = xScale(new Date(endDate)); // use min of endDate and currentDateRange[1]
  const topPos = margin.top + 5;
  console.log(margin, startX, endX, currentDateRange);
  return (
    <>
      <defs>
        <linearGradient id="Gradient2" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="black" />
          <stop offset="100%" stop-color="transparent" />
        </linearGradient>
      </defs>
      <g>
        <rect
          x={startX}
          y={topPos}
          width={endX - startX}
          height="100"
          fill="url(#Gradient2)"
        />
        <line x1={startX} x2={endX} y1={topPos} y2={topPos} stroke="black" />
        <circle cx={startX} cy={topPos} r={5} fill="black" />
        <circle cx={endX} cy={topPos} r={5} fill="black" />
      </g>
    </>
  );
};

TimeSeriesEventsLayer.propTypes = {};

export default TimeSeriesEventsLayer;
