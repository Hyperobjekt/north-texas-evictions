import React, { useContext } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Tooltip,
  Typography,
  withStyles,
} from "@material-ui/core";
import PropTypes from "prop-types";
import { useTimeSeriesEventData } from "../../Data/useTimeSeriesEventData";
import useTimeSeriesStore from "../../TimeSeries/hooks/useTimeSeriesStore";
import { DataContext } from "@visx/xychart";

/** Renders the events overlay on the time series chart */
const TimeSeriesEventsLayer = (props) => {
  const [setHoveredEvent, hoveredEvent] = useTimeSeriesStore((state) => [
    state.setHoveredEvent,
    state.hoveredEvent,
  ]);
  const { yScale, xScale, margin } = useContext(DataContext);
  const eventsSeries = useTimeSeriesEventData().data;
  if (!xScale || !margin?.top) return null;

  const isEventInRange = (eventDates, rangeDates) => {
    return (eventDates.start < rangeDates.start &&
      eventDates.end < rangeDates.start) ||
      (eventDates.start > rangeDates.end && eventDates.end > rangeDates.end)
      ? false
      : true;
  };

  const processedDates = (events, range) => {
    const rangeDates = { start: range[0], end: range[1] };
    let dates = [];
    events.forEach((event) => {
      const eventDates = {
        start: new Date(event.start),
        end: new Date(event.end),
      };
      if (isEventInRange(eventDates, rangeDates)) {
        const start =
          eventDates.start < rangeDates.start
            ? rangeDates.start
            : eventDates.start;
        const end =
          eventDates.end > rangeDates.end ? rangeDates.end : eventDates.end;
        const color = event.color;
        const id = event.id;
        dates.push({ start, end, color, id });
      }
    });
    return dates;
  };

  const topPos = margin.top + 10;
  const botPos = margin.bottom;

  const Glyph = ({ event, cx, cy, r, fill, center, arrowDir, children }) => {
    const angle = arrowDir === "right" ? 0 : arrowDir === "left" ? 180 : 90;
    return (
      <g
        xmlns="http://www.w3.org/2000/svg"
        width="6"
        height="8"
        viewBox="0 0 6 8"
        fill="none"
      >
        <circle cx={cx} cy={cy} r={r} fill={fill} />
        <path
          transform={`rotate(${angle} ${center[0]} ${center[1]}) scale(${
            r / 9
          }) translate(${cx + r - 1},${cy - r / 2 + 0.5})`}
          xmlns="http://www.w3.org/2000/svg"
          d="M0 0C2.00003 3 6 4 6 4C6 4 2.00003 5 0 8V0Z"
          fill={fill}
        />
        <text
          textAnchor="middle"
          dy="0.3em"
          x={cx}
          y={cy}
          stroke="#fff"
          strokeWidth="1px"
          fill="#fff"
          fontSize="12px"
          fontFamily={`"Roboto", "franklin-gothic-urw", "Helvetica", "Arial", sans-serif`}
        >
          {children}
        </text>
      </g>
    );
  };

  const EventRange = ({ event, xScale, index }) => {
    return (
      <>
        <defs>
          <linearGradient id="Gradient" x1="0" x2="0" y1="0" y2="1">
            <stop
              offset="0%"
              stop-color={event.color}
              stop-opacity={hoveredEvent?.id === event.id ? 0.15 : 0.07}
            />
            <stop offset="100%" stop-color="transparent" />
          </linearGradient>
        </defs>
        <g>
          <rect
            x={xScale(event.start)}
            y={topPos}
            width={xScale(event.end) - xScale(event.start)}
            height={yScale(0) - yScale(yScale.domain()[1])}
            fill="url(#Gradient)"
          />
          <line
            x1={xScale(event.start)}
            x2={xScale(event.end)}
            y1={topPos}
            y2={topPos}
            stroke={event.color}
            strokeWidth={2}
            strokeDasharray={"4,4"}
          />
          <Glyph
            cx={xScale(event.start)}
            cy={topPos}
            r={9}
            center={[xScale(event.start), topPos]}
            arrowDir="right"
            fill={event.color}
            event={event}
          >
            {index}
          </Glyph>
          <Glyph
            cx={xScale(event.end)}
            cy={topPos}
            r={9}
            center={[xScale(event.end), topPos]}
            arrowDir="left"
            fill={event.color}
            event={event}
          >
            {index}
          </Glyph>
        </g>
      </>
    );
  };

  const EventPoint = ({ event, xScale, index }) => {
    return (
      <>
        <g>
          <line
            x1={xScale(event.start)}
            x2={xScale(event.start)}
            y1={topPos}
            y2={yScale(0) - botPos}
            stroke={event.color}
            strokeWidth={2}
            strokeDasharray={"4,4"}
          />
          <Glyph
            cx={xScale(event.start)}
            cy={topPos}
            r={9}
            center={[xScale(event.start), topPos]}
            fill={event.color}
          >
            {index}
          </Glyph>
        </g>
      </>
    );
  };

  const EventOverlay = ({ events, xScale, margin }) => {
    return (
      <>
        {processedDates(events, xScale.domain())?.map((event) => {
          //if event.end > event.start it is a range, if they are the same it is a point
          return event.end > event.start ? (
            <EventRange event={event} xScale={xScale} index={event.id} />
          ) : (
            <EventPoint event={event} xScale={xScale} index={event.id} />
          );
        })}
      </>
    );
  };

  return <EventOverlay events={eventsSeries} xScale={xScale} margin={margin} />;
};

TimeSeriesEventsLayer.propTypes = {};

export default TimeSeriesEventsLayer;
