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

const LocationRow = ({
  id,
  name,
  pinned,
  color,
  onDismiss,
  onPin,
  ...props
}) => {
  return (
    <ListItem button {...props}>
      <LocationName name={name} alignItems="flex-start" textAlign="left" />
      <ListItemSecondaryAction>
        <IconButton
          size="small"
          style={{ marginRight: 8, color: pinned && color }}
          onClick={onPin}
        >
          <FiberPin />
        </IconButton>
        <IconButton size="small" onClick={onDismiss}>
          <Close />
        </IconButton>
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
  console.log("locations", locations);
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

  return (
    <Card noPadding title="Selected Locations">
      {locations.length === 0 && (
        <Box p={2} pt={1}>
          <Typography>Select a location using the map or search.</Typography>
        </Box>
      )}
      {locations.length > 0 && (
        <List>
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
    </Card>
  );
};

LocationsCard.propTypes = {};

export default LocationsCard;
