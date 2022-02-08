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
import {
  Card,
  StatsSummary,
  parseDate,
  useDashboardStore,
  useFormatter,
  formatDateRange,
} from "../../Dashboard";
import { useLang } from "../../Language";
import useTrendSeries from "../../TimeSeries/hooks/useTrendSeries";
import useSummaryStats from "../../Locations/hooks/useSummaryStats";
import useLocationsData from "../../Data/useLocationsData";
import shallow from "zustand/shallow";

// metrics to show on the summary card
const SUMMARY_METRICS = ["avg7", "avg30", "efr", "tfa"];

/**
 * Shows a summary of the eviction data, including the number of evictions,
 * trend line, and summary of stats.
 */
const EvictionSummaryCard = (props) => {
  //set state for displayed data
  const [view, setView] = useDashboardStore(
    (state) => [state.summaryView, state.setSummaryView],
    shallow
  );
  const isAllData = view === "all";

  // pull language
  const [allDataLabel, locationDataLabel, locationDataHint] = useLang([
    "LABEL_ALLDATA",
    "LABEL_LOCATIONDATA",
    "HINT_LOCATIONDATA",
  ]);

  // pull required data
  const { data: locationsData, status: locationsStatus } = useLocationsData();
  const { data: allData, status: allStatus } = useSummaryData();
  const isReady = isAllData
    ? allStatus === "success"
    : locationsStatus === "success";
  // pull current date range
  const dateRange = useDashboardStore((state) => state.activeDateRange);
  // get summary card language
  const langKeys = [`METRIC_EF`, `SUMMARY_UPDATED`, `SUMMARY`];
  const [label, lastUpdated, title] = useLang(langKeys, {
    date: timeFormat("%b %e, %Y")(parseDate(dateRange[1])),
    dateRange: formatDateRange(...dateRange, { short: true }).join(" - "),
  });

  // get stats and series for card
  const intFormatter = useFormatter("ef");
  const data = isAllData ? allData : locationsData;
  const totalFilings = isReady ? intFormatter(data?.ef) : "...";
  const stats = useSummaryStats(data, SUMMARY_METRICS);
  const [series, interval] = useTrendSeries(data?.series, dateRange, "ef");

  // get selected locations count
  const selectedLocations = useLocationStore((state) => state.locations);
  const hasLocations = selectedLocations.length > 0;

  // add tooltip to label if it is disabled
  const selectedDataButtonLabel = hasLocations ? (
    locationDataLabel
  ) : (
    <Tooltip title={locationDataHint} arrow>
      <span>{locationDataLabel}</span>
    </Tooltip>
  );

  //if locations are unselected leaving none, switch view to all data
  React.useEffect(() => {
    !isAllData && !hasLocations && setView("all");
  }, [hasLocations, view, isAllData, setView]);

  // sets the view to "all" or "selected"
  const handleToggleView = (view) => () => {
    setView(view);
  };

  return (
    <Card title={title} {...props}>
      <Box mb={2}>
        <ButtonGroup color="secondary" fullWidth>
          <Button
            variant={view === "all" && "contained"}
            onClick={handleToggleView("all")}
          >
            {allDataLabel}
          </Button>
          <Button
            variant={view === "selected" && "contained"}
            component={!hasLocations ? "div" : undefined} // use div when disabled so button emits events
            disabled={!hasLocations}
            onClick={hasLocations ? handleToggleView("selected") : undefined}
          >
            {selectedDataButtonLabel}
          </Button>
        </ButtonGroup>
      </Box>
      <StatsSummary
        value={totalFilings}
        label={label}
        series={series}
        stats={stats}
        interval={interval}
      >
        <Typography variant="caption" color="textSecondary" component="em">
          {lastUpdated}
        </Typography>
      </StatsSummary>
    </Card>
  );
};

export default EvictionSummaryCard;
