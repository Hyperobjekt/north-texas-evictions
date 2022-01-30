import { useTimeSeriesEventData } from "../../Data/useTimeSeriesEventData";
import { isEventInRange } from "../utils";
import { useDashboardDateRange } from "../../Dashboard";
import { EVENT_COLORS } from "../../Dashboard/constants";

export default function useTimeSeriesEventsInRange() {
  const eventsInRange = (events, range) => {
    const rangeDates = { start: new Date(range[0]), end: new Date(range[1]) };
    const dates = events.reduce((dates, event) => {
      const eventDates = {
        start: new Date(event.start),
        end: new Date(event.end),
      };
      if (isEventInRange(eventDates, rangeDates)) {
        const color = event.color;
        const id = event.id;
        const name = event.name;
        dates.push({ ...eventDates, color, id, name });
      }
      return dates;
    }, []);
    return dates.map((date, index) => {
      return {
        ...date,
        id: index + 1,
        color: EVENT_COLORS[index % EVENT_COLORS.length],
      };
    });
  };
  const events = useTimeSeriesEventData().data;
  const [activeDateRange] = useDashboardDateRange();
  const data =
    events && activeDateRange ? eventsInRange(events, activeDateRange) : [];
  return data;
}
