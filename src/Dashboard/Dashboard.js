import React, { useEffect } from "react";
import { Box } from "@material-ui/core";
import useLanguageStore from "../Language/useLanguageStore";
import useSetDashboardState from "./hooks/useSetDashboardState";
import { Legend } from "../Legend";
import { Map } from "../Map";
import { QueryClient, QueryClientProvider } from "react-query";
import Panel from "../Panel/Panel";
import { withStyles } from "@material-ui/styles";
import { Tooltip } from "../Tooltip";

// Create a client
const queryClient = new QueryClient();

const Wrapper = withStyles({
  root: {
    position: "relative",
    display: "flex",
    width: "100%",
    height: "100%",
    flex: 1,
    overflow: "hidden",
  },
})(Box);

const Dashboard = ({
  activeBubble,
  activeChoropleth,
  activeRegion,
  activeDateRange,
  regions,
  metrics,
  dateRange,
  filters,
  lang = "en",
  langDict,
}) => {
  // set up the app store and update when new props are received
  useSetDashboardState({
    activeBubble,
    activeChoropleth,
    activeRegion,
    activeDateRange,
    regions,
    metrics,
    dateRange,
    filters,
  });

  // update language on changes
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  useEffect(() => {
    setLanguage(lang, langDict);
  }, [lang, langDict, setLanguage]);

  return (
    <QueryClientProvider client={queryClient}>
      <Wrapper>
        <Box position="relative" style={{ flex: 1 }}>
          <Legend />
          <Map />
        </Box>
        <Panel open={true} />
        <Tooltip />
      </Wrapper>
    </QueryClientProvider>
  );
};

Dashboard.defaultProps = {
  lang: "en",
  langDict: {
    en: {
      APP_TITLE: "North Texas Evictions",
      BUTTON_MENU_OPEN: "Menu",
      METRIC_CPR: "Child Poverty Rate",
      METRIC_PVR: "Poverty Rate",
      METRIC_EF: "Eviction Filings",
      METRIC_EFR: "Filings Per 1000 Renters",
      METRIC_MFA: "Median Filing Amount",
      METRIC_PCW: "% Non-Hispanic White",
      METRIC_PCB: "% Black",
      METRIC_PCH: "% Latinx",
      METRIC_PCA: "% Asian",
      METRIC_MHI: "Median Household Income",
      METRIC_MGR: "Median Gross Rent",
      METRIC_MPV: "Median Property Value",
      METRIC_PRH: "% Renter Homes",
      METRIC_RB: "Rent Burden",
      METRIC_TFA: "Total Filing Amount",
      REGION_COUNTIES: "Counties",
      REGION_TRACTS: "Census Tracts",
      REGION_ZIPS: "ZIP Codes",
      REGION_PLACES: "Cities",
      LEGEND_SUMMARY: "between {{start}} and {{end}}",
      BUTTON_CHANGE_OPTIONS: "Change Data Options",
      SELECT_CHOROPLETH: "Demographic Metric",
      SELECT_BUBBLE: "Eviction Metric",
      SELECT_REGION: "Region",
      SELECT_DATE_START: "Start Date",
      SELECT_DATE_END: "End Date",
      TITLE_DATA_OPTIONS: "Data Options",
    },
  },
  activeBubble: "ef",
  activeChoropleth: "mhi",
  activeRegion: "tracts",
  regions: [
    {
      id: "counties",
      type: "geojson",
      choropleth:
        "https://raw.githubusercontent.com/childpovertyactionlab/cpal-evictions/main/demo/NTEP_demographics_county.geojson",
      bubble:
        "https://raw.githubusercontent.com/childpovertyactionlab/cpal-evictions/main/bubble/NTEP_bubble_county.geojson",
    },
    {
      id: "places",
      type: "geojson",
      choropleth:
        "https://raw.githubusercontent.com/childpovertyactionlab/cpal-evictions/main/demo/NTEP_demographics_place.geojson",
      bubble:
        "https://raw.githubusercontent.com/childpovertyactionlab/cpal-evictions/main/bubble/NTEP_bubble_place.geojson",
    },
    {
      id: "zips",
      type: "geojson",
      choropleth:
        "https://raw.githubusercontent.com/childpovertyactionlab/cpal-evictions/main/demo/NTEP_demographics_zip.geojson",
      bubble:
        "https://raw.githubusercontent.com/childpovertyactionlab/cpal-evictions/main/bubble/NTEP_bubble_zip.geojson",
    },
    {
      id: "tracts",
      type: "geojson",
      choropleth:
        "https://raw.githubusercontent.com/childpovertyactionlab/cpal-evictions/main/demo/NTEP_demographics_tract.geojson",
      bubble:
        "https://raw.githubusercontent.com/childpovertyactionlab/cpal-evictions/main/bubble/NTEP_bubble_tract.geojson",
    },
  ],
  metrics: [
    { id: "ef", type: "bubble", format: "integer" },
    { id: "efr", type: "bubble", format: "integer" },
    { id: "mfa", type: "bubble", format: "currency" },
    { id: "tfa", type: "secondary", format: "currency" },
    { id: "cpr", type: "choropleth", format: "percent" },
    { id: "mgr", type: "choropleth", format: "currency" },
    { id: "mhi", type: "choropleth", format: "currency" },
    { id: "mpv", type: "choropleth", format: "currency" },
    { id: "pca", type: "choropleth", format: "percent" },
    { id: "pcb", type: "choropleth", format: "percent" },
    { id: "pch", type: "choropleth", format: "percent" },
    { id: "pcw", type: "choropleth", format: "percent" },
    { id: "prh", type: "choropleth", format: "percent" },
    { id: "pvr", type: "choropleth", format: "percent" },
    { id: "rb", type: "choropleth", format: "percent" },
  ],
  dateRange: ["2018-01-01", "2021-05-01"],
  activeDateRange: ["2020-07-01", "2021-07-31"],
  filters: [],
};

Dashboard.propTypes = {};

export default Dashboard;
