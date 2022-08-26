import React from "react";
import {
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  withStyles,
} from "@material-ui/core";
import LocationName from "./LocationName";
import { Close } from "@material-ui/icons";
import { Stack } from "@hyperobjekt/material-ui-website";
import { HiddenIcon, VisibleIcon } from "../../Icons";
import { getSubLocationColor } from "../utils";

const LocationListItem = withStyles((theme) => ({
  root: {
    // so icons don't obscure name
    paddingRight: theme.spacing(10),
  },
}))(ListItem);

const SubLocationList = withStyles((theme) => ({
  root: {
    width: "100%",
    padding: theme.spacing(0, 5, 0, 2),
    marginBottom: theme.spacing(1),
    // sub precinct name
    "& .MuiTypography-root": {
      fontWeight: "normal",
    },
    // hide parent location name
    "& .MuiTypography-caption": {
      display: "none",
    },
    "& .MuiSvgIcon-root": {
      fontSize: 20,
    },
  },
}))(List);

const LocationRow = ({
  id,
  name,
  pinned,
  color,
  subLocations,
  onDismiss,
  onPin,
  onClick,
  ...props
}) => {
  const handlePinSublocation = (subLocation) => (event) =>
    onPin(event, subLocation);
  return (
    <>
      <LocationListItem button={Boolean(onClick)} onClick={onClick} {...props}>
        <LocationName name={name} alignItems="flex-start" textAlign="left" />
        <ListItemSecondaryAction>
          <Stack around="none" between="sm">
            <IconButton
              size="small"
              style={{ color: pinned ? color : "#ddd" }}
              onClick={onPin}
            >
              {pinned ? <VisibleIcon /> : <HiddenIcon />}
            </IconButton>
            {onDismiss && (
              <IconButton size="small" onClick={onDismiss}>
                <Close />
              </IconButton>
            )}
          </Stack>
        </ListItemSecondaryAction>
      </LocationListItem>
      {subLocations && (
        <SubLocationList>
          {subLocations.map((subLocation, i) => (
            <LocationRow
              key={subLocation.id}
              name={subLocation.name}
              color={getSubLocationColor(color, i, subLocations.length)}
              pinned={subLocation.pinned}
              onPin={handlePinSublocation(subLocation)}
            />
          ))}
        </SubLocationList>
      )}
    </>
  );
};

export default LocationRow;
