import React from "react";
import Panel from "../../Dashboard/components/Panel";
import useLocationStore from "../hooks/useLocationStore";
import shallow from "zustand/shallow";
import {
  Button,
  Divider,
  FormControlLabel,
  Switch,
  Typography,
} from "@material-ui/core";
import {
  getDateRangeLabel,
  StatsSummary,
  useDashboardStore,
  useDateOptions,
} from "../../Dashboard";
import { Stack } from "@hyperobjekt/material-ui-website";
import Stat from "../../Dashboard/components/Stat";
import { useLang } from "../../Language";
import { withStyles } from "@material-ui/styles";
import useFormatter, {
  useFormatters,
} from "../../Dashboard/hooks/useFormatter";
import useLocationSeries from "../hooks/useLocationSeries";
import useSummaryStats from "../hooks/useSummaryStats";
import useTrendSeries from "../../TimeSeries/hooks/useTrendSeries";
import { LocationName } from "..";

const PANEL_METRICS = [
  "pop",
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

const getRegionFromFeature = (feature) => {
  const source = feature?.source;
  if (!source) return null;
  return source.split("-")[0];
};

const ControlLabel = withStyles((theme) => ({
  root: {
    marginLeft: 0,
    marginTop: `16px!important`,
  },
  label: {
    marginRight: "auto",
  },
}))(FormControlLabel);

const LocationPanel = ({ ...props }) => {
  const [active, setActive, pinned, addPinned, removePinned] = useLocationStore(
    (state) => [
      state.active,
      state.setActive,
      state.pinned,
      state.addPinned,
      state.removePinned,
    ],
    shallow
  );
  const dateRange = useDashboardStore((state) => state.activeDateRange);

  // 👇 Eviction Metric Summary
  const dateOptions = useDateOptions();
  const [, dateLabel] = getDateRangeLabel(...dateRange, dateOptions || []);
  // pull eviction summary data for location
  const [summary] = useLocationSeries(active ? [active] : [], dateRange);
  // formatter + label for eviction filings
  const filingsFormatter = useFormatter("ef");
  const filingsLabel = useLang("METRIC_EF");
  // list of secondary stats
  const stats = useSummaryStats(summary?.data);
  // use the 7 day moving average if more than 14 days
  const series = useTrendSeries(summary?.data?.series, dateRange, "ef");

  // 👇 Demographic Metric Summary
  // get formatters and labels for demographic metrics
  const labels = useLang(PANEL_METRICS.map((m) => `METRIC_${m}`));
  const formatters = useFormatters(PANEL_METRICS);
  // get values for demographic metrics
  const values = PANEL_METRICS.map((m, i) =>
    formatters[i](active?.properties?.[m])
  );

  // 👇 Pinned locations
  // determine if this location is pinned
  const isPinned =
    pinned.findIndex((feature) => feature.id === active?.id) !== -1;
  // handler for toggling pinned status
  const handlePinToggle = () => {
    isPinned ? removePinned(active) : addPinned(active);
  };

  // 👇 Region Switch (if active region is different)
  // pull region info for switching region if needed
  const [activeRegion, setActiveRegion] = useDashboardStore(
    (state) => [state.activeRegion, state.setActiveRegion],
    shallow
  );
  const regionId = getRegionFromFeature(active);

  return (
    <Panel
      id="locationPanel"
      open={active}
      title={active && <LocationName name={active.properties.name} />}
      onClose={() => setActive(null)}
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
      <Divider />
      <ControlLabel
        value="start"
        control={
          <Switch
            color="primary"
            checked={isPinned}
            onChange={handlePinToggle}
          />
        }
        label="Show on map + chart"
        labelPlacement="start"
      />
      {regionId !== activeRegion && (
        <Button
          variant="contained"
          fullWidth
          onClick={() => setActiveRegion(regionId)}
        >
          Show {regionId} on map
        </Button>
      )}
    </Panel>
  );
};

LocationPanel.propTypes = {};

export default LocationPanel;
