import React from "react";
import {
  Box,
  Typography,
  ButtonGroup,
  Button,
  Tooltip,
} from "@material-ui/core";
import { timeFormat } from "d3-time-format";
import useSummaryData from "../../Data/useSummaryData";
import { useLocationStore } from "../../Locations";
import useSelectedLocationData from "../../Data/useSelectedLocationData";
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
  view,
  handleToggleView,
  selectedLocations,
  ...props
}) => {
  const selectedDataButtonLabel =
    selectedLocations.length > 0 ? (
      "Selected Locations"
    ) : (
      <Tooltip
        title={
          selectedLocations.length > 0
            ? undefined
            : `You have not selected any locations`
        }
        arrow
      >
        <span>Selected Locations</span>
      </Tooltip>
    );

  return (
    <Card title={title} {...props}>
      <Box mb={2}>
        <ButtonGroup color="secondary" fullWidth>
          <Button
            variant={view === "all" && "contained"}
            onClick={handleToggleView("all")}
          >
            All Data
          </Button>
          <Button
            variant={view === "selected" && "contained"}
            component={selectedLocations.length === 0 ? "div" : undefined} // use div when disabled so button emits events
            disabled={selectedLocations.length === 0}
            onClick={
              selectedLocations.length > 0 && handleToggleView("selected")
            }
          >
            {selectedDataButtonLabel}
          </Button>
        </ButtonGroup>
      </Box>
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
  //set state for displayed data
  const [view, setView] = React.useState("all");

  const handleToggleView = (view) => (e) => {
    setView(view);
  };

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

  const intFormatter = useFormatter("ef");
  const allStatsSeries = {
    // get primary metric
    value: isReady ? intFormatter(summary.ef) : "...",
    // list of secondary stats
    stats: useSummaryStats(summary, SUMMARY_METRICS),
    //use the 7 day moving average if more than 14 days
    series: useTrendSeries(summary?.series, dateRange, "ef"),
  };

  //get selected locations to set view state and to get data
  const selectedLocations = useLocationStore((state) => state.locations);
  //organize into object
  const selectedStatsSeries = {
    value: intFormatter(
      useSelectedLocationData(selectedLocations, dateRange)?.selectedStatsRaw
        ?.data?.ef
    ),
    stats: useSummaryStats(
      useSelectedLocationData(selectedLocations, dateRange)?.selectedStatsRaw
        ?.data,
      SUMMARY_METRICS
    ),
    series: useSelectedLocationData(selectedLocations, dateRange).selectedSeries
      ?.data?.series,
  };

  //if locations are unselected leaving none, switch view to all data
  React.useEffect(() => {
    if (view === "selected" && selectedLocations.length === 0) {
      setView("all");
    }
  }, [selectedLocations, view]);

  return (
    <SummaryCard
      {...{
        title,
        label,
        view,
        handleToggleView,
        selectedLocations,
      }}
      {...(view === "all" ? allStatsSeries : selectedStatsSeries)}
      {...props}
    >
      <Typography variant="caption" color="textSecondary" component="em">
        {lastUpdated}
      </Typography>
    </SummaryCard>
  );
};

export default EvictionSummaryCard;
