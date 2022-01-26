import React from "react";
import { Box, Typography } from "@material-ui/core";
import { formatDateRange } from "../../Dashboard";
import { formatDateString } from "../../Dashboard/utils";
import EventMarker from "./EventMarker";

/** Renders and SVG of the event marker */
const Glyph = ({ r, fill, children, ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={r * 2}
      viewBox={`0 0 24 ${r * 2}`}
      style={{ minWidth: 24 }} // prevent svg from getting condensed
      {...props}
    >
      <EventMarker arrow={false} cx={r} cy={r} r={r} fill={fill}>
        {children}
      </EventMarker>
    </svg>
  );
};

/**
 * Renders an event marker, with the corresponding event name and date range.
 */
const TimeSeriesEvent = ({
  id,
  name,
  color,
  radius = 9,
  start,
  end,
  ...props
}) => {
  const dateLabel =
    start === end
      ? formatDateString(start, { short: true })
      : formatDateRange(...[start, end], { short: true }).join(" - ");
  return (
    <Box
      mt={2}
      flexDirection="column"
      alignItems="flex-start"
      justifyContent="flex-start"
      {...props}
    >
      <Box display="flex" alignItems="center" justifyContent="flex-start">
        <Glyph r={radius} fill={color}>
          {id}
        </Glyph>
        <Box ml={0.5}>
          <Typography variant="h2">{name}</Typography>
        </Box>
      </Box>
      <Box display="flex" alignItems="center" pl={3.5}>
        <Typography component="span" variant="caption" color="textSecondary">
          {dateLabel}
        </Typography>
      </Box>
    </Box>
  );
};

export default TimeSeriesEvent;
