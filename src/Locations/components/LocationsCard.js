import React from "react";
import useSelectedLocations from "../hooks/useSelectedLocations";
import useLocationStore from "../hooks/useLocationStore";
import Card from "../../Dashboard/components/Card";
import { Box, Button, List, Tooltip, Typography } from "@material-ui/core";
import shallow from "zustand/shallow";
import useLocationColors from "../hooks/useLocationColors";
import { useDashboardStore } from "../../Dashboard";
import useTimeSeriesStore from "../../TimeSeries/hooks/useTimeSeriesStore";
import { ALL_DATA_COLOR } from "../../Dashboard/constants";
import LocationRow from "./LocationRow";
import useLocationLoader from "../hooks/useLocationLoader";
import CardActions from "../../Dashboard/components/CardActions";
import ExpandIcon from "../../Icons/ExpandIcon";

/**
 * A card showing all selected locations, along with toggles for visibility,
 * and an action to compare the selected locations.
 */
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

  // an effect hook that adds locations to store when selected
  useSelectedLocations();

  // an effect hook that loads locations when they are added to the load queue
  useLocationLoader();

  // helper function that determines pinned status of a location
  const isLocationPinned = (location) =>
    pinned.findIndex((l) => l.id === location.id) > -1;

  // activates a location and enable location view when clicked
  const handleSelect = (location) => {
    return () => {
      setActive(location);
      setShowLocations(true);
    };
  };

  // removes pinned status and a location when the dismiss button is clicked
  const handleRemove = (location) => {
    return () => {
      isLocationPinned(location) && removePinned(location);
      removeLocation(location);
    };
  };

  // toggles pinned status of a location when the pin button is clicked
  const handlePin = (location) => {
    return () => {
      const isPinned = isLocationPinned(location);
      isPinned && removePinned(location);
      !isPinned && addPinned(location);
    };
  };

  // toggles whether to show the "all data" view in time series
  const handleToggleShowAll = () => {
    setShowOverall(!showOverall);
  };

  // toggles the side-by-side card view (location comparison)
  const handleToggleCompare = () => {
    setShowLocations(!showLocations);
    setExpandLocations(true);
  };

  const hasLocations = locations.length > 0;
  const hasMultipleLocations = locations.length > 1;
  const compareHint =
    !hasMultipleLocations &&
    `Select two or more locations using the map or search to compare.`;

  // actions for the card (compare locations button)
  const actions = (
    <CardActions>
      <Button
        disabled={!hasMultipleLocations}
        variant="outlined"
        onClick={handleToggleCompare}
      >
        <ExpandIcon style={{ marginRight: 8, fontSize: 20 }} /> Compare
        Locations
      </Button>
    </CardActions>
  );

  return (
    <Card noPadding title="Selected Locations" {...props}>
      {/* list of locations */}
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
      {/* Hint when no locations are selected */}
      {!hasLocations && (
        <Box p={2} pt={1}>
          <Typography component="em" color="textSecondary">
            Click a location on the map or use the location search to add them
            here.
          </Typography>
        </Box>
      )}
      {/* card actions */}
      {compareHint && (
        <Tooltip title={compareHint} placement="top" arrow>
          {actions}
        </Tooltip>
      )}
      {!compareHint && actions}
    </Card>
  );
};

export default LocationsCard;
