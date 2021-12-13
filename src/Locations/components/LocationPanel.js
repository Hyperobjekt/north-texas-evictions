import React, { useLayoutEffect } from "react";
import Panel from "../../Dashboard/components/Panel";
import { Divider, Typography } from "@material-ui/core";
import {
  getDateRangeLabel,
  StatsSummary,
  useDateOptions,
} from "../../Dashboard";
import { Stack } from "@hyperobjekt/material-ui-website";
import Stat from "../../Dashboard/components/Stat";
import { useLang } from "../../Language";
import useFormatter, {
  useFormatters,
} from "../../Dashboard/hooks/useFormatter";
import useLocationSeries from "../hooks/useLocationSeries";
import useSummaryStats from "../hooks/useSummaryStats";
import useTrendSeries from "../../TimeSeries/hooks/useTrendSeries";
import { TimeComparison } from "../../TimeComparison";
import { LocationName, useLocationStore } from "..";
import shallow from "zustand/shallow";

const PANEL_METRICS = [
  "pop",
  "rhh",
  "pvr",
  "cpr",
  "prh",
  "mgr",
  "mpv",
  "mhi",
  "rb",
  "pca",
  "pcb",
  "pcw",
  "pch",
];

const LocationPanel = ({
  syncScroll,
  feature,
  dateRange,
  children,
  ...props
}) => {
  // 👇 Eviction Metric Summary
  const dateOptions = useDateOptions();
  const [, dateLabel] = getDateRangeLabel(...dateRange, dateOptions || []);
  // pull eviction summary data for location
  const [summary] = useLocationSeries(feature ? [feature] : [], dateRange);
  // formatter + label for eviction filings
  const filingsFormatter = useFormatter("ef");
  const filingsLabel = useLang("METRIC_EF");
  // list of secondary stats
  const stats = useSummaryStats(summary?.data);
  // use the 7 day moving average if more than 14 days
  const series = useTrendSeries(summary?.data?.series, dateRange, "ef");
  // scroll position
  const bodyRef = React.useRef();
  const [scrollPosition, setScrollPosition] = useLocationStore(
    (state) => [state.scrollPosition, state.setScrollPosition],
    shallow
  );
  useLayoutEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = scrollPosition;
    }
  }, [scrollPosition]);

  // 👇 Demographic Metric Summary
  // get formatters and labels for demographic metrics
  const labels = useLang(PANEL_METRICS.map((m) => `METRIC_${m}`));
  const formatters = useFormatters(PANEL_METRICS);
  // get values for demographic metrics
  const values = PANEL_METRICS.map((m, i) =>
    formatters[i](feature?.properties?.[m])
  );

  const handleScroll = (e) => {
    syncScroll && setScrollPosition(e.target.scrollTop);
  };

  return (
    <Panel
      id="locationPanel"
      title={feature && <LocationName name={feature.properties.name} />}
      onScroll={handleScroll}
      bodyRef={bodyRef}
      {...props}
    >
      <Typography variant="overline" color="textSecondary">
        Filings Summary ({dateLabel})
      </Typography>
      {summary && (
        <StatsSummary
          value={filingsFormatter(summary?.data?.ef)}
          label={filingsLabel}
          series={series}
          stats={stats}
        />
      )}
      <Divider />
      <TimeComparison />
      <Divider />
      <Typography variant="overline" color="textSecondary">
        Demographics Summary
      </Typography>
      <Stack
        direction="vertical"
        between="md"
        around="none"
        alignItems="stretch"
      >
        {PANEL_METRICS.map((id, i) => (
          <Stat key={i + 2} label={labels[i]} value={values[i]} />
        ))}
      </Stack>
      {children}
    </Panel>
  );
};

export default LocationPanel;
