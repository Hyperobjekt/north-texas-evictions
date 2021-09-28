import React from "react";
import Panel from "../../Panel/Panel";
import LocationName from "../../App/components/LocationName";
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
import { useDashboardStore } from "../../Dashboard";
import { Stack } from "@hyperobjekt/material-ui-website";
import Stat from "../../Dashboard/components/Stat";
import { useLang } from "../../Language";
import { withStyles } from "@material-ui/styles";
import { useFormatters } from "../../Dashboard/hooks/useFormatter";

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
  const [activeRegion, setActiveRegion] = useDashboardStore(
    (state) => [state.activeRegion, state.setActiveRegion],
    shallow
  );

  const labels = useLang(PANEL_METRICS.map((m) => `METRIC_${m}`));

  // get formatters for metrics
  const formatters = useFormatters(PANEL_METRICS);

  const regionId = getRegionFromFeature(active);
  const isPinned =
    pinned.findIndex((feature) => feature.id === active?.id) !== -1;

  const values = PANEL_METRICS.map((m, i) =>
    formatters[i](active?.properties?.[m])
  );

  const handlePinToggle = () => {
    isPinned ? removePinned(active) : addPinned(active);
  };

  return (
    <Panel
      open={active}
      title={active && <LocationName name={active.properties.name} />}
      onClose={() => setActive(null)}
      {...props}
    >
      <Box
        height={80}
        bgcolor="grey.200"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography color="textSecondary">
          Eviction Metric Summary + time series
        </Typography>
      </Box>
      <Divider />
      <Stack
        direction="vertical"
        between="sm"
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
        label="Pin to map"
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
