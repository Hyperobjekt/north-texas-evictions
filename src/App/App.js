import React, { useEffect } from "react";

import Dashboard, { formatDate } from "../Dashboard";
import { useLanguageStore } from "../Language";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { About } from "../About";

const GEOJSON_ROOT = process.env.REACT_APP_GEOJSON_ENDPOINT;

const App = ({ lang = "en", langDict, config }) => {
  //👇 update language on changes
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  useEffect(() => {
    setLanguage(lang, langDict);
  }, [lang, langDict, setLanguage]);

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Dashboard config={config} />
        </Route>
        <Route path="/about">
          <About />
        </Route>
      </Switch>
    </Router>
  );
};

App.defaultProps = {
  config: {
    activeBubble: "efr",
    activeChoropleth: "mhi",
    activeRegion: "counties",
    activeDateRange: ["2021-01-01", formatDate(new Date())],
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
            options: { scaleFactor: 2 },
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
        id: "courts",
        layers: [
          {
            id: "bubble",
            type: "geojson",
            source: GEOJSON_ROOT + "bubble/NTEP_bubble_jpcourt.geojson",
            options: { scaleFactor: 1.25 },
          },
          {
            id: "choropleth",
            type: "geojson",
            source: GEOJSON_ROOT + "demo/NTEP_demographics_jpcourt.geojson",
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
        // unavailable: ["tracts", "districts"],
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
        // unavailable: ["tracts"],
      },
      { id: "pop", type: "secondary", format: "integer" },
      { id: "rhh", type: "secondary", format: "integer" },
      { id: "avg7", type: "secondary", format: "perday" },
      { id: "avg30", type: "secondary", format: "perday" },
    ],
    dateRange: ["2018-01-01", "2022-05-01"],
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
      METRIC_POP: "Population",
      METRIC_RHH: "Occupied Renter Households",
      METRIC_AVG7: "7-day Filing Average",
      METRIC_AVG30: "30-day Filing Average",
      REGION_COUNTIES: "Counties",
      REGION_TRACTS: "Census Tracts",
      REGION_ZIPS: "ZIP Codes",
      REGION_CITIES: "Cities",
      REGION_DISTRICTS: "Council Districts",
      REGION_COURTS: "Justice of the Peace Precincts",
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
      HINT_AVG7:
        "Average eviction filings per day in the last 7 days.  The leftmost number shows the change compared to the previous 7-day period.",
      HINT_AVG30:
        "Average eviction filings per day in the last 30 days.  The leftmost number shows the change compared to the previous 30-day period.",
      HINT_MFA:
        "Median filing amounts are only available within Dallas County.",
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
