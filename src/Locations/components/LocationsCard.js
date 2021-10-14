import React from "react";
import useSelectedLocations from "../hooks/useSelectedLocations";
import useLocationStore from "../hooks/useLocationStore";
import Card from "../../Dashboard/components/Card";
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  Typography,
} from "@material-ui/core";
import LocationName from "../../App/components/LocationName";
import { Close, FiberPin } from "@material-ui/icons";
import shallow from "zustand/shallow";
import useLocationColors from "../hooks/useLocationColors";
import { useDashboardStore } from "../../Dashboard";
import useTimeSeriesStore from "../../TimeSeries/hooks/useTimeSeriesStore";
import { Stack } from "@hyperobjekt/material-ui-website";

const LocationRow = ({
  id,
  name,
  pinned,
  color,
  onDismiss,
  onPin,
  onClick,
  ...props
}) => {
  return (
    <ListItem button={Boolean(onClick)} onClick={onClick} {...props}>
      <LocationName name={name} alignItems="flex-start" textAlign="left" />
      <ListItemSecondaryAction>
        <Stack around="none" between="sm">
          <IconButton
            size="small"
            style={{ color: pinned && color }}
            onClick={onPin}
          >
            <FiberPin />
          </IconButton>
          {onDismiss && (
            <IconButton size="small" onClick={onDismiss}>
              <Close />
            </IconButton>
          )}
        </Stack>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

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
  const activeView = useDashboardStore((state) => state.activeView);
  const [showOverall, setShowOverall] = useTimeSeriesStore(
    (state) => [state.showOverall, state.setShowOverall],
    shallow
  );

  const locationColors = useLocationColors(locations);

  // adds locations to store when selected
  useSelectedLocations();

  const isLocationPinned = (location) =>
    pinned.findIndex((l) => l.id === location.id) > -1;

  const handleSelect = (location) => {
    return () => {
      setActive(location);
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

  const hasLocations = activeView === "series" ? true : locations.length > 0;

  return (
    <Card noPadding title="Selected Locations">
      {hasLocations && (
        <List>
          {activeView === "series" && (
            <LocationRow
              id="all"
              name={"All Data"}
              color={"#f00"}
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
      )}
      {!hasLocations && (
        <Box p={2} pt={1}>
          <Typography>Select a location using the map or search.</Typography>
        </Box>
      )}
    </Card>
  );
};

LocationsCard.propTypes = {};

export default LocationsCard;
