import React from "react";
import {
  IconButton,
  ListItem,
  ListItemSecondaryAction,
} from "@material-ui/core";
import LocationName from "./LocationName";
import { Close } from "@material-ui/icons";
import { Stack } from "@hyperobjekt/material-ui-website";
import { HiddenIcon, VisibleIcon } from "../../Icons";

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
    </ListItem>
  );
};

export default LocationRow;
