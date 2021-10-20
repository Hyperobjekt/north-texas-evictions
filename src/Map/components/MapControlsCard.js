import React from "react";
import { Typography } from "@material-ui/core";
import { ArrowDropDown } from "@material-ui/icons";
import { Stack } from "@hyperobjekt/material-ui-website";
import { useLang } from "../../Language";
import {
  useDashboardStore,
  useDashboardBubble,
  useDashboardChoropleth,
  useDashboardRegion,
  useDashboardDateRange,
  useDateOptions,
  Card,
  InlineMenu,
  getDateRangeLabel,
} from "../../Dashboard";
import usePrecinctFilter from "../../Data/usePrecinctFilter";
import usePrecinctNames from "../../Data/usePrecinctNames";
import TogglePanelButton from "../../Panel/TogglePanelButton";

const MapTextControls = ({ ...props }) => {
  const setActivePanel = useDashboardStore((state) => state.setActivePanel);
  const [activeDateRange, setActiveDateRange] = useDashboardDateRange();
  const dateOptions = useDateOptions();
  const [activeRegion, setActiveRegion, regions] = useDashboardRegion();
  const [activeBubble, setActiveBubble, bubbleMetrics] = useDashboardBubble();
  const [activeChoropleth, setActiveChoropleth, choroplethMetrics] =
    useDashboardChoropleth();

  // prepare language
  const langKeys = [
    `METRIC_${activeBubble}`,
    `METRIC_${activeChoropleth}`,
    `REGION_${activeRegion}`,
  ];
  const [bubbleName, choroplethName, regionName] = useLang(langKeys);

  // date labels
  const [datePrefix, dateLabel] = getDateRangeLabel(
    ...activeDateRange,
    dateOptions
  );

  // get active precinct filter (if any)
  const [precinct] = usePrecinctFilter();
  const precinctNames = usePrecinctNames();
  const precinctLabel = <span> for {precinctNames[precinct]}</span>;

  const handleSetDateRange = (e, option) => {
    option?.value && setActiveDateRange(option.value);
    if (!option?.value && option !== "backdropClick") {
      setActivePanel("DATA_OPTIONS");
    }
  };

  return (
    <Stack direction="vertical" between="sm" around="md" {...props}>
      <InlineMenu
        variant="h2"
        color="textPrimary"
        selected={activeRegion}
        options={regions}
        onSelect={(e, option) => {
          option?.id && setActiveRegion(option.id);
        }}
      >
        {regionName} <ArrowDropDown style={{ margin: "-0.75em 0px -0.3em" }} />
      </InlineMenu>
      <Typography color="textSecondary">
        <InlineMenu
          options={bubbleMetrics}
          color="primary"
          selected={activeBubble}
          onSelect={(e, option) => {
            option?.id && setActiveBubble(option.id);
          }}
        >
          {bubbleName}
        </InlineMenu>
        <span> and </span>
        <InlineMenu
          options={choroplethMetrics}
          color="secondary"
          selected={activeChoropleth}
          onSelect={(e, option) => {
            option?.id && setActiveChoropleth(option.id);
          }}
        >
          {choroplethName}
        </InlineMenu>
        <span> {datePrefix} </span>
        <InlineMenu options={dateOptions} onSelect={handleSetDateRange}>
          {dateLabel}
        </InlineMenu>
        {precinct && precinctLabel}
      </Typography>
    </Stack>
  );
};

const MapControlsCard = (props) => {
  return (
    <Card noPadding title="Currently Viewing" {...props}>
      <MapTextControls />
      <TogglePanelButton
        variant="outlined"
        fullWidth
        style={{
          backgroundColor: "transparent",
          borderWidth: 0,
          borderTopWidth: 1,
        }}
      />
    </Card>
  );
};

export default MapControlsCard;
