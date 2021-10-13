import React, { useEffect } from "react";
import Header from "./components/Header";
import Body from "./components/Body";
import Loading from "./components/Loading";
import Router from "./components/Router";
import TwoColumnLayout from "./components/TwoColumnLayout";

import Dashboard, {
  useDashboardDefaults,
  useDashboardStore,
} from "../Dashboard";
import { useLanguageStore } from "../Language";
import { Map } from "../Map";
import { Tooltip } from "../Tooltip";
import { LocationPanel } from "../Locations";
import { ControlsPanel } from "../Controls";
import { Cards } from "../Cards";
import { getCurrentRouteParams } from "./router";
import { Box } from "@material-ui/core";

const GEOJSON_ROOT = process.env.REACT_APP_GEOJSON_ENDPOINT;

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

  const activeView = useDashboardStore((state) => state.activeView);

  return (
    <Dashboard>
      <Router />
      <Header></Header>
      {ready ? (
        <Body bgcolor="background.default" flex={1} overflow="auto">
          <ControlsPanel float position="left" />
          <LocationPanel float position="right" />
          <TwoColumnLayout
            left={<Cards />}
            right={activeView === "map" ? <Map /> : <Box>Time Series</Box>}
          />
        </Body>
      ) : (
        <Loading />
      )}
      <Tooltip yOffset={40} />
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
        layers: [
          {
            id: "bubble",
            type: "geojson",
            source: GEOJSON_ROOT + "bubble/NTEP_bubble_county.geojson",
            options: { scaleFactor: 5 },
          },
          {
            id: "choropleth",
            type: "geojson",
            source: GEOJSON_ROOT + "demo/NTEP_demographics_county.geojson",
          },
        ],
      },
      {
        id: "cities",
        layers: [
          {
            id: "bubble",
            type: "geojson",
            source: GEOJSON_ROOT + "bubble/NTEP_bubble_place.geojson",
            options: { scaleFactor: 3 },
          },
          {
            id: "choropleth",
            type: "geojson",
            source: GEOJSON_ROOT + "demo/NTEP_demographics_place.geojson",
          },
        ],
      },
      {
        id: "zips",
        layers: [
          {
            id: "bubble",
            type: "geojson",
            source: GEOJSON_ROOT + "bubble/NTEP_bubble_zip.geojson",
            options: { scaleFactor: 1.5 },
          },
          {
            id: "choropleth",
            type: "geojson",
            source: GEOJSON_ROOT + "demo/NTEP_demographics_zip.geojson",
          },
        ],
      },
      {
        id: "districts",
        layers: [
          {
            id: "bubble",
            type: "geojson",
            source: GEOJSON_ROOT + "bubble/NTEP_bubble_council.geojson",
            options: { scaleFactor: 1.5 },
          },
          {
            id: "choropleth",
            type: "geojson",
            source: GEOJSON_ROOT + "demo/NTEP_demographics_council.geojson",
          },
        ],
      },
      {
        id: "tracts",
        layers: [
          {
            id: "bubble",
            type: "geojson",
            source: GEOJSON_ROOT + "bubble/NTEP_bubble_tract.geojson",
            options: { scaleFactor: 1.1 },
          },
          {
            id: "choropleth",
            type: "geojson",
            source: GEOJSON_ROOT + "demo/NTEP_demographics_tract.geojson",
          },
        ],
      },
    ],
    metrics: [
      { id: "ef", type: "bubble", format: "integer" },
      { id: "efr", type: "bubble", format: "integer" },
      { id: "mfa", type: "bubble", format: "currency" },
      { id: "tfa", type: "secondary", format: "currency" },
      {
        id: "mgr",
        type: "choropleth",
        format: "currency",
        unavailable: ["tracts", "districts"],
        scale: "quantize",
        scaleOptions: { amount: 5 },
      },
      {
        id: "mhi",
        type: "choropleth",
        format: "currency",
        scale: "quantize",
        scaleOptions: { amount: 5 },
      },
      {
        id: "mpv",
        type: "choropleth",
        format: "currency",
        scale: "quantize",
        scaleOptions: { amount: 5 },
      },
      { id: "pca", type: "choropleth", format: "percent" },
      { id: "pcb", type: "choropleth", format: "percent" },
      { id: "pch", type: "choropleth", format: "percent" },
      { id: "pcw", type: "choropleth", format: "percent" },
      { id: "prh", type: "choropleth", format: "percent" },
      {
        id: "pvr",
        type: "choropleth",
        format: "percent",
        scale: "quantize",
        scaleOptions: { amount: 5 },
      },
      {
        id: "cpr",
        type: "choropleth",
        format: "percent",
        scale: "quantize",
        scaleOptions: { amount: 5 },
      },
      {
        id: "rb",
        type: "choropleth",
        format: "percent",
        unavailable: ["tracts"],
      },
      { id: "pop", type: "secondary", format: "integer" },
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
      METRIC_PCW: "% White (Non-Hispanic)",
      METRIC_PCB: "% Black",
      METRIC_PCH: "% Hispanic",
      METRIC_PCA: "% Asian",
      METRIC_MHI: "Median Household Income",
      METRIC_MGR: "Median Gross Rent",
      METRIC_MPV: "Median Property Value",
      METRIC_PRH: "% Renter Homes",
      METRIC_RB: "Rent Burden",
      METRIC_TFA: "Total Filing Amount",
      METRIC_POP: "Renter Households",
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
      FLAG_COLLIN_DENTON:
        "Eviction filing data is not available for Denton and Collin County before 2019.",
      FLAG_TARRANT:
        "Eviction filing data is not available for Tarrant County before 2020.",
      HINT_EF: "",
      HINT_TFA:
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
