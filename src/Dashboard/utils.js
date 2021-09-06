import { timeFormat, timeParse } from "d3-time-format";

export const formatDate = timeFormat("%Y-%m-%d");

export const parseDate = timeParse("%Y-%m-%d");
