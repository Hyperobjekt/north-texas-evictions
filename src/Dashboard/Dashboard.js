import React from "react";
import { Page, Header, Body, Loading, TwoColumnLayout } from "../App";
import { useDashboardDefaults, useDashboardStore } from ".";
import { Tooltip } from "../Tooltip";
import { LocationPanel } from "../Locations";
import { ControlsPanel } from "../Controls";
import { Cards } from "../Cards";
import { HashRouter, getCurrentRouteParams } from "../HashRouter";
import Visual from "./components/Visual";
import { DataProvider } from "../Data";
import ViewButtonGroup from "../Controls/components/ViewButtonGroup";
import { Search } from "../Search";
import { Link } from "react-router-dom";
import { Box, Button, Typography } from "@material-ui/core";
import { Analytics } from "../Analytics/Analytics";

const Dashboard = ({ config, ...props }) => {
  // pull ready state from the store
  const ready = useDashboardStore((state) => state.ready);

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
    <DataProvider>
      <Page>
        <Analytics />
        <HashRouter />
        <Header sticky stickyOffset={0}>
          <ViewButtonGroup />
          <Search />
          <Button
            variant="contained"
            className="dark"
            component={Link}
            to="/about"
            style={{ height: 42 }}
          >
            About
          </Button>
        </Header>
        {ready ? (
          <Body bgcolor="background.default" flex={1}>
            <LocationPanel float position="left" />
            <ControlsPanel float position="left" />
            <TwoColumnLayout left={<Cards />} right={<Visual />} />
          </Body>
        ) : (
          <Box
            display="flex"
            flex={1}
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            bgcolor="background.default"
          >
            <Loading />
            <Typography style={{ marginTop: "1rem" }}>Loading...</Typography>
          </Box>
        )}
        <Tooltip yOffset={40} />
      </Page>
    </DataProvider>
  );
};

Dashboard.defaultProps = {};

Dashboard.propTypes = {};

export default Dashboard;
