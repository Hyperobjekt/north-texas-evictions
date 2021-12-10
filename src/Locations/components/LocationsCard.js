import React from "react";
import useSelectedLocations from "../hooks/useSelectedLocations";
import useLocationStore from "../hooks/useLocationStore";
import Card from "../../Dashboard/components/Card";
import { Box, Button, List, Typography } from "@material-ui/core";
import shallow from "zustand/shallow";
import useLocationColors from "../hooks/useLocationColors";
import { useDashboardStore } from "../../Dashboard";
import useTimeSeriesStore from "../../TimeSeries/hooks/useTimeSeriesStore";
import { ALL_DATA_COLOR } from "../../Dashboard/constants";
import LocationRow from "./LocationRow";
import useLocationLoader from "../hooks/useLocationLoader";

const LocationsCard = (props) => {
  const [
    setActive,
    locations,
    removeLocation,
    pinned,
    addPinned,
    removePinned,
  ] = useLocationStore(
    (state) => [
      state.setActive,
      state.locations,
      state.removeLocation,
      state.pinned,
      state.addPinned,
      state.removePinned,
    ],
    shallow
  );
  const [showLocations, setShowLocations, setExpandLocations] =
    useLocationStore(
      (state) => [
        state.showLocations,
        state.setShowLocations,
        state.setExpandLocations,
      ],
      shallow
    );

  const activeView = useDashboardStore((state) => state.activeView);
  const [showOverall, setShowOverall] = useTimeSeriesStore(
    (state) => [state.showOverall, state.setShowOverall],
    shallow
  );

  const locationColors = useLocationColors(locations);

  // adds locations to store when selected
  useSelectedLocations();

  useLocationLoader();

  const isLocationPinned = (location) =>
    pinned.findIndex((l) => l.id === location.id) > -1;

  const handleSelect = (location) => {
    return () => {
      setActive(location);
      setShowLocations(true);
    };
  };

  const handleRemove = (location) => {
    return () => {
      isLocationPinned(location) && removePinned(location);
      removeLocation(location);
    };
  };

  const handlePin = (location) => {
    return () => {
      const isPinned = isLocationPinned(location);
      isPinned && removePinned(location);
      !isPinned && addPinned(location);
    };
  };

  const handleToggleShowAll = () => {
    setShowOverall(!showOverall);
  };

  const handleToggleCompare = () => {
    setShowLocations(!showLocations);
    setExpandLocations(true);
  };

  const hasLocations = locations.length > 0;

  return (
    <Card noPadding title="Location Legend">
      <List
        style={{
          display: activeView === "map" && locations.length === 0 && "none",
        }}
      >
        {activeView === "series" && (
          <LocationRow
            id="all"
            name={"All Data"}
            color={ALL_DATA_COLOR}
            pinned={showOverall}
            onPin={handleToggleShowAll}
          />
        )}
        {locations.map((location, i) => (
          <LocationRow
            key={location.properties.id}
            id={location.properties.id}
            name={location.properties.name}
            color={locationColors[i]}
            pinned={isLocationPinned(location)}
            onClick={handleSelect(location)}
            onDismiss={handleRemove(location)}
            onPin={handlePin(location)}
          />
        ))}
      </List>

      {!hasLocations && (
        <Box p={2} pt={1}>
          <Typography component="em" color="textSecondary">
            Select locations using the map or search.
          </Typography>
        </Box>
      )}
      {/* TODO: refactor this into it's own component, remove inline styles, bring in toggle state */}
      {hasLocations && (
        <Button
          fullWidth
          variant="outlined"
          onClick={handleToggleCompare}
          style={{
            margin: "0 -1px -1px -1px",
            width: "calc(100% + 2px)",
            borderRadius: "0 0 8px 8px",
          }}
        >
          Compare Locations
        </Button>
      )}
    </Card>
  );
};

LocationsCard.propTypes = {};

export default LocationsCard;
