import { useTimeSeriesEventData } from "./useTimeSeriesEventData";
import { isEventInRange } from "../utils";
import { useDashboardDateRange, parseDate } from "../../Dashboard";
import { EVENT_COLORS } from "../../Dashboard/constants";

/**
 * Returns events that fall within the given date range
 * @param {*} events
 * @param {*} range
 * @returns
 */
const getEventsInRange = (events, range) => {
  const rangeDates = { start: parseDate(range[0]), end: parseDate(range[1]) };
  return events
    .reduce((dates, event) => {
      const eventDates = {
        start: parseDate(event.start),
        end: parseDate(event.end),
      };
      if (isEventInRange(eventDates, rangeDates))
        dates.push({ ...event, ...eventDates });
      return dates;
    }, [])
    .map((date, index) => ({
      ...date,
      id: index + 1,
      color: EVENT_COLORS[index % EVENT_COLORS.length],
    }));
};

/**
 * Returns events that are within the current active range
 */
export default function useTimeSeriesEventsInRange() {
  const dataUrl =
    process.env.REACT_APP_EVENTS_ENDPOINT || "./assets/NTEP_events.csv";
  const events = useTimeSeriesEventData(dataUrl).data;
  const [activeDateRange] = useDashboardDateRange();
  return events && activeDateRange
    ? getEventsInRange(events, activeDateRange)
    : [];
}
