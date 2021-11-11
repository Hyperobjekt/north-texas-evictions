import React from "react";
import Panel from "../../Dashboard/components/Panel";
import useLocationStore from "../hooks/useLocationStore";
import shallow from "zustand/shallow";
import {
  Box,
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
import { ArrowLeft, ArrowRight } from "@material-ui/icons";
import Close from "@material-ui/icons/Close";

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

export const LocationsStack = ({ ...props }) => {
  const [showLocations, setShowLocations] = useLocationStore(
    (state) => [state.showLocations, state.setShowLocations],
    shallow
  );
  const locations = useLocationStore((state) => state.pinned);
  const removePinned = useLocationStore((state) => state.removePinned);
  const active = useLocationStore((state) => state.active);
  const locationsStack = active
    ? [
        active,
        ...locations.filter((l) => l.properties.id !== active.properties.id),
      ]
    : locations;
  const activeDateRange = useDashboardStore((state) => state.activeDateRange);
  const [expandLocations, setExpandLocations] = useLocationStore(
    (state) => [state.expandLocations, state.setExpandLocations],
    shallow
  );
  const handleToggleExpand = () => setExpandLocations(!expandLocations);
  const handleToggleLocations = () => {
    setShowLocations(!showLocations);
    expandLocations && setExpandLocations(false);
  };
  const handleDismissLocation = (feature) => (event) => {
    console.log(feature);
    removePinned(feature);
  };
  return (
    <Box
      style={{
        position: "fixed",
        top: 64,
        bottom: 0,
        left: showLocations ? 0 : -360,
        width: "100%",
        pointerEvents: expandLocations ? "all" : "none",
        maxHeight: "calc(100vh - 64px)",
        zIndex: 100,
        overflow: "auto",
        backgroundColor: expandLocations
          ? "rgba(255,255,255,0.8)"
          : "transparent",
        transition: "all 0.2s ease",
      }}
    >
      {locationsStack.reverse().map((feature, i) => (
        <DummyPanel
          key={i}
          absolute={true}
          feature={feature}
          dateRange={activeDateRange}
          offset={
            (locations.length - 1 - i) *
            (expandLocations ? 320 : 8 / (locations.length - i) + 4)
          }
          open={true}
          style={{
            zIndex: 10 + locations.length + i,
            maxWidth: 320,
            pointerEvents: "all",
          }}
          onClose={handleDismissLocation(feature)}
        />
      ))}
      <Button
        variant="contained"
        square={true}
        onClick={handleToggleLocations}
        style={{
          position: "fixed",
          top: 76,
          left: !showLocations
            ? -88
            : expandLocations
            ? "calc(100vw - 104px)"
            : 240,
          width: 80,
          transition: "all 0.4s ease",
          zIndex: 100,
          pointerEvents: "all",
          borderRadius: "2px 0 0 2px",
        }}
      >
        {!expandLocations && <ArrowLeft style={{ marginLeft: -8 }} />}
        Close
        {expandLocations && (
          <Close
            style={{ marginRight: -8, marginLeft: 4, fontSize: 16, height: 24 }}
          />
        )}
      </Button>
      <Button
        variant="contained"
        onClick={handleToggleExpand}
        style={{
          position: "fixed",
          top: 76,
          left: !showLocations
            ? -96
            : expandLocations
            ? "calc(100vw - 204px)"
            : 256,
          transition: "all 0.4s ease",
          zIndex: 10 + locations.length + locations.length - 2,
          pointerEvents: "all",
        }}
      >
        {expandLocations && (
          <>
            <ArrowLeft style={{ marginLeft: -8 }} /> Collapse
          </>
        )}
        {!expandLocations && (
          <>
            Compare <ArrowRight style={{ marginRight: -8 }} />
          </>
        )}
      </Button>
    </Box>
  );
};

const DummyPanel = ({ feature, dateRange, children, ...props }) => {
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

  // 👇 Demographic Metric Summary
  // get formatters and labels for demographic metrics
  const labels = useLang(PANEL_METRICS.map((m) => `METRIC_${m}`));
  const formatters = useFormatters(PANEL_METRICS);
  // get values for demographic metrics
  const values = PANEL_METRICS.map((m, i) =>
    formatters[i](feature?.properties?.[m])
  );

  return (
    <Panel
      id="locationPanel"
      title={feature && <LocationName name={feature.properties.name} />}
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
      {children}
    </Panel>
  );
};

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
