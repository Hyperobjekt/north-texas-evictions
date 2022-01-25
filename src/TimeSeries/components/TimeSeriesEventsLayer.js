import React, { useContext } from "react";
import { useTimeSeriesEventData } from "../../Data/useTimeSeriesEventData";
import { DataContext } from "@visx/xychart";

/** Renders the events overlay on the time series chart */
const TimeSeriesEventsLayer = (props) => {
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

  const doesEventOverlap = (eventDates, rangeDates) => {
    const isEventPoint =
      eventDates.start.toISOString() === eventDates.end.toISOString();
    const isRangePoint =
      rangeDates.start.toISOString() === rangeDates.end.toISOString();

    if (isEventInRange(eventDates, rangeDates)) {
      //if neither event nor range is a point, they overlap
      if (!isEventPoint && !isRangePoint) {
        return true;
        //thus, the range or event is a point, and if one of their starts or ends is the same, they overlap
      } else if (
        eventDates.start.toISOString() === rangeDates.start.toISOString() ||
        eventDates.end.toISOString() === rangeDates.end.toISOString()
      ) {
        return true;
      } else {
        return false;
      }
    }
  };

  const createTiers = (events) => {
    const tiers = [];
    events.forEach((event) => {
      let fits = null;
      //if the levels array has already been populated
      if (tiers.length > 0) {
        //check every tier in the tiers array
        for (let index = 0; index < tiers.length; index++) {
          const tier = tiers[index];
          let isOverlapping = false;
          //check every range in the current tier
          for (let i = 0; i < tier.length; i++) {
            const range = tier[i];
            if (doesEventOverlap(event, range)) {
              isOverlapping = true;
              break;
            }
            //if none of the ranges in the tier overlap with the event (or if the event is a single date), set the fits var to the index of the tier and stop checking
          }
          if (!isOverlapping) {
            fits = index;
            break;
          }
        }
        //if the fits var was set to a level index, add the event to that level
        if (fits !== null) {
          tiers[fits].push(event);
          //else make a new level with the event
        } else {
          tiers.push([event]);
        }
        //if the levels array is empty, create a new level with the event
      } else {
        tiers.push([event]);
      }
    });
    return tiers;
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

  const Glyph = ({ cx, cy, r, fill, center, arrowDir, children }) => {
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

  const EventRange = ({ event, xScale, tier }) => {
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
              <Glyph
                cx={coord}
                cy={top}
                r={glyphRadius}
                center={[coord, top]}
                arrowDir={i === 0 ? "right" : "left"}
                fill={color}
                event={event}
              >
                {id}
              </Glyph>
            );
          })}
        </g>
      </>
    );
  };

  const EventPoint = ({ event, xScale, tier }) => {
    const start = xScale(event.start);
    const color = event.color;
    const id = event.id;
    const glyphRadius = 9;
    const tierModifier = (glyphRadius + 1) * 2 * tier;
    const top = topPos + tierModifier;

    return (
      <>
        <g>
          <line
            x1={start}
            x2={start}
            y1={top}
            y2={yScale(0) - 15}
            stroke={color}
            strokeWidth={2}
            strokeDasharray={"4,4"}
          />
          <Glyph cx={start} cy={top} r={9} center={[start, top]} fill={color}>
            {id}
          </Glyph>
        </g>
      </>
    );
  };

  const EventOverlay = ({ events, xScale }) => {
    return (
      <>
        {createTiers(processedDates(events, xScale.domain()))?.map(
          (tier, tierIndex) => {
            return tier.map((event) => {
              //if event.end > event.start it is a range, if they are the same it is a point
              return event.end > event.start ? (
                <EventRange event={event} xScale={xScale} tier={tierIndex} />
              ) : (
                <EventPoint event={event} xScale={xScale} tier={tierIndex} />
              );
            });
          }
        )}
      </>
    );
  };

  return <EventOverlay events={eventsSeries} xScale={xScale} margin={margin} />;
};

TimeSeriesEventsLayer.propTypes = {};

export default TimeSeriesEventsLayer;
