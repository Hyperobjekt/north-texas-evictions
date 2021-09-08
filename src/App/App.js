import React, { useEffect } from "react";
import Dashboard from "../Dashboard";
import Header from "./components/Header";
import useDashboardRoute from "../Dashboard/hooks/useDashboardRoute";
import Search from "../Search";
import useDashboardStore from "../Dashboard/hooks/useDashboardStore";
import useDashboardDefaults from "../Dashboard/hooks/useDashboardDefaults";
import { CircularProgress } from "@material-ui/core";
import { QueryClient, QueryClientProvider } from "react-query";

// Create a client
const queryClient = new QueryClient();

const App = ({ config }) => {
  // pull ready state from the store
  const ready = useDashboardStore((state) => state.ready);

  const { route, getCurrentParams } = useDashboardRoute();

  // load params from route on mount (if any)
  const routeDefaults = getCurrentParams();

  // update route on state changes
  useEffect(() => {
    // do not set in not ready or undefined route
    if (!ready || route.indexOf("undefined") > -1 || route.indexOf("null") > -1)
      return null;
    window.history && window.history.replaceState(null, null, route);
  }, [route, ready]);

  // set the default dashboard state
  useDashboardDefaults({
    ...config,
    ...routeDefaults,
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Header>
        <Search />
      </Header>
      {ready ? <Dashboard /> : <CircularProgress />}
    </QueryClientProvider>
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
    filters: [],
    zoom: 8,
    lat: 32.74,
    lon: -96.96,
  },
};

App.propTypes = {};

export default App;
