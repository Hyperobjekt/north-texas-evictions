import React from "react";
import { Box, List, ListItem, Typography } from "@material-ui/core";
import { useTimeSeriesEventData } from "../../Data/useTimeSeriesEventData";
import { Card, formatDateString } from "../../Dashboard";
import { withStyles } from "@material-ui/styles";

const styles = (theme) => ({});

const Glyph = ({ r, fill, children }) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={r * 2}
        height={r * 2}
        viewBox={`0 0 ${r * 2} ${r * 2}`}
        fill="none"
      >
        <circle cx={r} cy={r} r={r} fill={fill} />
        <text
          textAnchor="middle"
          dy="0.3em"
          x={r}
          y={r}
          stroke="#fff"
          strokeWidth="1px"
          fill="#fff"
          fontSize="12px"
          fontFamily={`"Roboto", "franklin-gothic-urw", "Helvetica", "Arial", sans-serif`}
        >
          {children}
        </text>
      </svg>
    </>
  );
};

const TimeSeriesEventsCard = (props) => {
  const eventsSeries = useTimeSeriesEventData().data;
  const glyphRadius = 9;

  return (
    <Card title={`Events Legend`} {...props}>
      <Box mt={-1} mb={2}></Box>
      <Box ml={-2} mr={-2} width="calc(100% + 2rem)">
        <List disablePadding>
          {eventsSeries?.map((event) => (
            <ListItem key={event.name}>
              <Box>
                <Box component="span" display="flex" alignItems="center">
                  <Box
                    pr={1}
                    width={glyphRadius * 2}
                    height={glyphRadius * 2}
                    boxSizing={"content-box"}
                  >
                    <Glyph r={glyphRadius} fill={event.color}>
                      {event.id}
                    </Glyph>
                  </Box>
                  <Typography variant="h2">{event.name}</Typography>
                </Box>
                <Box component="span" display="flex" alignItems="center">
                  <Box
                    pr={1}
                    width={glyphRadius * 2}
                    boxSizing={"content-box"}
                  ></Box>
                  <Typography
                    component="span"
                    variant="caption"
                    color="textSecondary"
                  >
                    {event.start === event.end
                      ? formatDateString(...[event.start, event.end], {
                          short: true,
                          point: true,
                        })
                      : formatDateString(...[event.start, event.end], {
                          short: true,
                        }).join(" - ")}
                  </Typography>
                </Box>
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>
    </Card>
  );
};

TimeSeriesEventsCard.propTypes = {};

export default withStyles(styles)(TimeSeriesEventsCard);
