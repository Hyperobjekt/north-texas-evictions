import React from "react";
import { Typography } from "@material-ui/core";
import { timeFormat } from "d3-time-format";
import useSummaryData from "../../Data/useSummaryData";
import {
  Card,
  StatsSummary,
  parseDate,
  useDashboardStore,
  useFormatter,
  formatDateString,
} from "../../Dashboard";
import { useLang } from "../../Language";
import useTrendSeries from "../../TimeSeries/hooks/useTrendSeries";
import useSummaryStats from "../../Locations/hooks/useSummaryStats";

// metrics to show on the summary card
const SUMMARY_METRICS = ["avg7", "avg30", "efr", "tfa"];

/**
 * A presentational component for displaying a data summary card
 */
export const SummaryCard = ({
  title,
  value,
  label,
  series,
  stats,
  children,
  ...props
}) => {
  return (
    <Card title={title} {...props}>
      <Typography
        variant="caption"
        component="h2"
        color="textSecondary"
        style={{ marginTop: "-0.5rem", marginBottom: "1rem" }}
      >
        For All Counties
      </Typography>
      <StatsSummary value={value} label={label} series={series} stats={stats}>
        {children}
      </StatsSummary>
    </Card>
  );
};

/**
 * Shows a summary of the eviction data, including the number of evictions,
 * trend line, and summary of stats.
 */
const EvictionSummaryCard = (props) => {
  // pull required data
  const { data: summary, status } = useSummaryData();
  const isReady = status === "success";
  // pull current date range
  const dateRange = useDashboardStore((state) => state.activeDateRange);
  // get summary card language
  const langKeys = [`METRIC_EF`, `SUMMARY_UPDATED`, `SUMMARY`];
  const [label, lastUpdated, title] = useLang(langKeys, {
    date: timeFormat("%b %e, %Y")(parseDate(dateRange[1])),
    dateRange: formatDateString(...dateRange, { short: true }).join(" - "),
  });
  // get primary metric
  const intFormatter = useFormatter("ef");
  const value = isReady ? intFormatter(summary.ef) : "...";
  // list of secondary stats
  const stats = useSummaryStats(summary, SUMMARY_METRICS);
  // use the 7 day moving average if more than 14 days
  const series = useTrendSeries(summary?.series, dateRange, "ef");
  return (
    <SummaryCard {...{ title, label, value, stats, series }} {...props}>
      <Typography variant="caption" color="textSecondary" component="em">
        {lastUpdated}
      </Typography>
    </SummaryCard>
  );
};

export default EvictionSummaryCard;
