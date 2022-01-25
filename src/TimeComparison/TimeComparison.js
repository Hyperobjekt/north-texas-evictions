import {
  Box,
  Button,
  ButtonGroup,
  Tooltip,
  Typography,
  withStyles,
} from "@material-ui/core";
import React from "react";
import TimeComparisonChart from "./components/TimeComparisonChart";
import TimeComparisonLegend from "./components/TimeComparisonLegend";
import useComparisonLines from "./hooks/useComparisonLines";
import PropTypes from "prop-types";
import { getXTooltipFormatter, getXTickFormatter } from "../TimeSeries/utils";
import { useLocationStore } from "../Locations";
import shallow from "zustand/shallow";

export const styles = (theme) => ({});

const TimeComparison = ({ labelOverrides, compareToYear, feature }) => {
  const [view, setView] = useLocationStore(
    (state) => [state.comparisonType, state.setComparisonType],
    shallow
  );

  const { lines, canCompare } = useComparisonLines(
    feature.properties.id,
    compareToYear,
    labelOverrides,
    view
  );
  const yAccessor = (d) => d?.ef;
  const xAccessor = (d) => d && new Date(`${d["date"]}T00:00:00`);
  const xTooltipFormatter = getXTooltipFormatter("monthly");
  const xTickFormatter = getXTickFormatter({
    group: "monthly",
    includeYear: false,
  });
  const yTickFormatter = view === "counts" ? (d) => d : (d) => `${d}%`;
  const yFormatter = (d) =>
    view === "counts" ? d.toFixed(0) : `${d.toFixed(0)}%`;

  const handleToggleView = (view) => (e) => {
    setView(view);
  };

  // add a tooltip to the relative comparison button if unavailable
  const relativeButtonLabel = canCompare ? (
    "Relative to 2019 (Pre-COVID)"
  ) : (
    <Tooltip
      title={
        canCompare
          ? undefined
          : `Pre-COVID data is not available for ${feature.properties.name}`
      }
      arrow
    >
      <span>Relative to 2019 (Pre-COVID)</span>
    </Tooltip>
  );

  const hasChart = view === "counts" || canCompare;

  return (
    <>
      <Typography variant="overline" color="textSecondary">
        Eviction Filings By Year
      </Typography>
      <ButtonGroup color="secondary">
        <Button
          variant={view === "counts" && "contained"}
          onClick={handleToggleView("counts")}
        >
          Filing Counts
        </Button>
        <Button
          variant={view === "relative" && "contained"}
          component={!canCompare ? "div" : undefined} // use div when disabled so button emits events
          disabled={!canCompare}
          onClick={canCompare ? handleToggleView("relative") : undefined}
        >
          {relativeButtonLabel}
        </Button>
      </ButtonGroup>
      {hasChart && (
        <>
          <TimeComparisonChart
            compareToYear={compareToYear}
            view={view}
            height={300}
            margin={{ right: 0, top: 16, left: 45, bottom: 32 }}
            xAccessor={xAccessor}
            yAccessor={yAccessor}
            yFormatter={yFormatter}
            xTickFormatter={xTickFormatter}
            yTickFormatter={yTickFormatter}
            xTooltipFormatter={xTooltipFormatter}
            lines={lines}
          />
          <TimeComparisonLegend
            lines={lines}
            compareToYear={compareToYear}
            view={view}
          />
        </>
      )}
      {!hasChart && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height={314}
          p={6}
          bgcolor="grey.100"
          borderRadius={4}
          style={{ marginTop: 16 }}
        >
          <Typography variant="caption" align="center">
            Pre-COVID data unavailable for this location.
          </Typography>
        </Box>
      )}
    </>
  );
};

TimeComparison.propTypes = {
  compareToYear: PropTypes.string.isRequired,
};

export default withStyles(styles)(TimeComparison);
