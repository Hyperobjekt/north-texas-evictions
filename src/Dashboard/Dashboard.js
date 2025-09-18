import React, { useState } from "react";
import { Page, Header, Body, Loading, TwoColumnLayout } from "../App";
import { useDashboardDefaults, useDashboardStore } from ".";
import { Tooltip } from "../Tooltip";
import { ControlsPanel } from "../Controls";
import { Cards } from "../Cards";
import { HashRouter, getCurrentRouteParams } from "../HashRouter";
import Visual from "./components/Visual";
import { DataProvider } from "../Data";
import ViewButtonGroup from "../Controls/components/ViewButtonGroup";
import { Search } from "../Search";
import { Link } from "react-router-dom";
import { Box, Button, Typography, Modal } from "@material-ui/core";
import { Analytics } from "../Analytics/Analytics";
import { LocationsStack } from "../Locations";

const Dashboard = ({ config, ...props }) => {
  // No longer need to show this Modal, but we will keep the logic here to quickly be able to add it again if needed.
  // const [isIntroModalOpen, setIsIntroModalOpen] = useState(true);
  const [isIntroModalOpen, setIsIntroModalOpen] = useLocalStorageState(
    "intro-modal",
    {
      defaultValue: true,
    }
  );

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

        <Modal
          open={isIntroModalOpen}
          onClose={() => setIsIntroModalOpen(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              borderRadius: 4,
              boxShadow: 24,
              p: 4,
              display: "flex",
              flexDirection: "column",
              outline: 0,
            }}
          >
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              September 18, 2025: CPAL recently acquired a more complete dataset
              of Dallas County eviction filings via public record request. The
              North Texas Eviction Project has now been updated and includes
              additional Dallas County filings not present in earlier versions
              of the dataset. Collin, Denton, and Tarrant County data is
              unchanged. The data is now available for the entire state of
              Texas.
            </Typography>
            <Button
              className={"dark"}
              style={{
                marginLeft: "auto",
                marginTop: 16,
              }}
              variant="contained"
              onClick={() => setIsIntroModalOpen(false)}
            >
              Dismiss
            </Button>
          </Box>
        </Modal>

        {ready ? (
          <Body bgcolor="background.default" flex={1}>
            <LocationsStack />
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
