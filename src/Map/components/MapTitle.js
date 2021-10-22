import React from "react";
import { Typography } from "@material-ui/core";
import { useLang } from "../../Language";
import {
  useDashboardStore,
  useDashboardBubble,
  useDashboardDateRange,
  useDateOptions,
  InlineMenu,
  getDateRangeLabel,
  useDashboardRegion,
  useDashboardChoropleth,
} from "../../Dashboard";
import { Stack } from "@hyperobjekt/material-ui-website";

const MapTitle = ({ ...props }) => {
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

  const handleSetDateRange = (e, option) => {
    option?.value && setActiveDateRange(option.value);
    if (!option?.value && option !== "backdropClick") {
      setActivePanel("DATA_OPTIONS");
    }
  };

  return (
    <Stack
      flexWrap="wrap"
      alignItems="baseline"
      fontSize={14}
      between="sm"
      around="md"
      style={{
        background:
          "linear-gradient(rgba(255,255,255,1), rgba(255,255,255,0.7))",
        backdropFilter: `blur(2px)`,
        textShadow: "0px 1px 1px rgba(255,255,255,1)",
      }}
      {...props}
    >
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
      <Typography component="span"> and </Typography>
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
      <Typography component="span"> {datePrefix} </Typography>
      <InlineMenu options={dateOptions} onSelect={handleSetDateRange}>
        {dateLabel}
      </InlineMenu>
      <Typography component="span"> for </Typography>
      <InlineMenu
        color="textPrimary"
        selected={activeRegion}
        options={regions}
        onSelect={(e, option) => {
          option?.id && setActiveRegion(option.id);
        }}
      >
        {regionName}
      </InlineMenu>
    </Stack>
  );
};

export default MapTitle;
