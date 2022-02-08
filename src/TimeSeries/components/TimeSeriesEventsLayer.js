import React, { useContext } from "react";
import { DataContext } from "@visx/xychart";
import EventMarker from "./EventMarker";
import { createTiers, processDates } from "../utils";

const EventRange = ({ event, xScale, tier, top: topPos, yScale }) => {
  const color = event.color;
  const coords = [xScale(event.start), xScale(event.end)];
  const id = event.id;
  const glyphRadius = 9;
  const tierModifier = (glyphRadius + 1) * 2 * tier;
  const top = topPos + tierModifier;
  const height = yScale(0) - yScale(yScale.domain()[1]) - tierModifier;

  return (
    <>
      <defs>
        <linearGradient id={`${id}-gradient`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color={color} stop-opacity={0.07} />
          <stop offset="100%" stop-color="transparent" />
        </linearGradient>
      </defs>
      <g>
        <rect
          x={coords[0]}
          y={top}
          width={coords[1] - coords[0]}
          height={height}
          fill={`url(#${id}-gradient)`}
        />
        <line
          x1={coords[0]}
          x2={coords[1]}
          y1={top}
          y2={top}
          stroke={color}
          strokeWidth={2}
          strokeDasharray={"4,4"}
        />
        {coords.map((coord, i) => {
          return (
            <EventMarker
              cx={coord}
              cy={top}
              r={glyphRadius}
              arrowDir={i === 0 ? "right" : "left"}
              fill={color}
              event={event}
            >
              {id}
            </EventMarker>
          );
        })}
      </g>
    </>
  );
};

const EventPoint = ({ event, xScale, tier, top: topPos, yScale }) => {
  const start = xScale(event.start);
  const color = event.color;
  const id = event.id;
  const glyphRadius = 9;
  const tierModifier = (glyphRadius + 1) * 2 * tier;
  const top = topPos + tierModifier;

  return (
    <g>
      <line
        x1={start}
        x2={start}
        y1={top}
        y2={yScale(0)}
        stroke={color}
        strokeWidth={2}
        strokeDasharray={"4,4"}
      />
      <EventMarker cx={start} cy={top} r={9} fill={color}>
        {id}
      </EventMarker>
    </g>
  );
};

/** Renders the events overlay on the time series chart */
const TimeSeriesEventsLayer = ({ events }) => {
  const { yScale, xScale, margin } = useContext(DataContext);
  if (!xScale || !margin?.top) return null;
  const eventsSeries = processDates(events, xScale.domain());
  const top = margin.top;
  const tiers = createTiers(eventsSeries);
  if (tiers.length === 0) return null;
  return (
    <>
      {tiers.map((tier, tierIndex) =>
        tier.map((event) => {
          //if event.end > event.start it is a range, if they are the same it is a point
          const Component = event.end > event.start ? EventRange : EventPoint;
          return (
            <Component
              key={event.id}
              tier={tierIndex}
              {...{ top, event, xScale, yScale }}
            />
          );
        })
      )}
    </>
  );
};

TimeSeriesEventsLayer.propTypes = {};

export default TimeSeriesEventsLayer;
