import React from "react";
import { List } from "@material-ui/core";
import { useTimeSeriesEventData } from "../../Data/useTimeSeriesEventData";
import { Card } from "../../Dashboard";
import TimeSeriesEvent from "./TimeSeriesEvent";
import { useLang } from "../../Language";

/**
 * Renders a card that shows all events visible in the time series.
 */
const TimeSeriesEventsCard = (props) => {
  const cardTitle = useLang("TITLE_EVENTS");
  const eventsSeries = useTimeSeriesEventData().data;
  const glyphRadius = 9;
  return (
    <Card title={cardTitle} {...props}>
      <List disablePadding>
        {eventsSeries?.map((event, i) => (
          <TimeSeriesEvent
            key={event.name}
            component={"li"}
            radius={glyphRadius}
            mt={i === 0 ? 0 : 2}
            {...event}
          />
        ))}
      </List>
    </Card>
  );
};

export default TimeSeriesEventsCard;
