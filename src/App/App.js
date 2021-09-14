import React, { useEffect } from "react";
import Dashboard from "../Dashboard";
import Header from "./components/Header";
import Search from "../Search";
import useDashboardStore from "../Dashboard/hooks/useDashboardStore";
import useDashboardDefaults from "../Dashboard/hooks/useDashboardDefaults";
import useLanguageStore from "../Language/useLanguageStore";
import { Legend } from "../Legend";
import { Map } from "../Map";
import Panel from "../Panel/Panel";
import { Tooltip } from "../Tooltip";
import Body from "./components/Body";
import Loading from "./components/Loading";
import { getCurrentRouteParams } from "./router";
import Router from "./components/Router";

const App = ({ lang = "en", langDict, config }) => {
  // pull ready state from the store
  const ready = useDashboardStore((state) => state.ready);

  //👇 update language on changes
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  useEffect(() => {
    setLanguage(lang, langDict);
  }, [lang, langDict, setLanguage]);

  // 👇 set the default dashboard state based on route params + config
  useDashboardDefaults({
    ...config,
    ...getCurrentRouteParams(),
    defaultViewport: {
      zoom: config.zoom,
      latitude: config.latitude,
      longitude: config.longitude,
    },
  });

  return (
    <Dashboard>
      <Router />
      <Header>
        <Search />
      </Header>
      {ready ? (
        <Body>
          <Map>
            <Legend />
          </Map>
          <Panel />
        </Body>
      ) : (
        <Loading />
      )}
      <Tooltip />
    </Dashboard>
  );
};

App.defaultProps = {
  config: {
    activeBubble: "ef",
    activeChoropleth: "mhi",
    activeRegion: "tracts",
    activeDateRange: ["2020-07-01", "2021-07-31"],
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
        id: "cities",
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
        id: "districts",
        type: "geojson",
        choropleth:
          "https://raw.githubusercontent.com/childpovertyactionlab/cpal-evictions/main/demo/NTEP_demographics_council.geojson",
        bubble:
          "https://raw.githubusercontent.com/childpovertyactionlab/cpal-evictions/main/bubble/NTEP_bubble_council.geojson",
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
      {
        id: "mgr",
        type: "choropleth",
        format: "currency",
        unavailable: ["tracts", "districts"],
      },
      { id: "mhi", type: "choropleth", format: "currency" },
      { id: "mpv", type: "choropleth", format: "currency" },
      { id: "pca", type: "choropleth", format: "percent" },
      { id: "pcb", type: "choropleth", format: "percent" },
      { id: "pch", type: "choropleth", format: "percent" },
      { id: "pcw", type: "choropleth", format: "percent" },
      { id: "prh", type: "choropleth", format: "percent" },
      { id: "pvr", type: "choropleth", format: "percent" },
      {
        id: "rb",
        type: "choropleth",
        format: "percent",
        unavailable: ["tracts"],
      },
    ],
    dateRange: ["2018-01-01", "2022-05-01"],
    filters: [],
    zoom: 8,
    latitude: 32.74,
    longitude: -96.96,
  },
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
      REGION_CITIES: "Cities",
      REGION_DISTRICTS: "Council Districts",
      LEGEND_SUMMARY: "between {{start}} and {{end}}",
      BUTTON_CHANGE_OPTIONS: "Change Data Options",
      SELECT_CHOROPLETH: "Demographic Metric",
      SELECT_BUBBLE: "Eviction Metric",
      SELECT_REGION: "Region",
      SELECT_DATE_START: "Start Date",
      SELECT_DATE_END: "End Date",
      SELECT_COURT: "Court",
      SELECT_DATE_RANGE: "Date Range",
      TITLE_DATA_OPTIONS: "Data Options",
      SUMMARY: "Summary ({{dateRange}})",
      SUMMARY_EF: "Total Eviction Filings",
      SUMMARY_TFA: "Total Amount Filed",
      SUMMARY_SERIES: "Filings By Day",
      SUMMARY_UPDATED: "Data last updated on {{date}}.",
      LEGEND: "Map Legend",
      LEGEND_TITLE: "Currently Viewing",
      FLAG_MFA:
        "Median filings amounts are only available within Dallas County. ",
      FLAG_SHORT_EFR:
        "Filings per 1,000 renters will be small for short time ranges.",
      HINT_TOTAL_FILINGS: "",
      HINT_TOTAL_AMOUNT:
        "Filing amounts are only reported within Dallas County, the actual total is much higher.",
      LABEL_ALL_COURTS: "All Courts",
      LABEL_FIT_BOUNDS: "Zoom to all {{region}}",
      LABEL_UNAVAILABLE: "Unavailable",
      LABEL_REGION_UNAVAILABLE: "Unavailable for {{region}}",
      LABEL_SHOW_LEGEND: "Show Full Legend",
      LABEL_HIDE_LEGEND: "Show Full Map",
      LABEL_SHOW_DATA_OPTIONS: "Show All Data Options",
    },
  },
};

App.propTypes = {};

export default App;
