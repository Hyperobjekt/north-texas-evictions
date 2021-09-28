import React from "react";
import { Box, Typography } from "@material-ui/core";

/** Returns the title and subtitle values based on the data */
export const getNameParts = (fullName) => {
  if (!fullName) return ["Unavailable", ""];
  const [name, parent] = fullName.split(",");
  return [name, parent || "Texas"];
};

const LocationName = ({ name: fullName, ...props }) => {
  const [name, parent] = getNameParts(fullName);
  return (
    <Box {...props}>
      <Typography variant="h2">{name}</Typography>
      {parent && (
        <Typography component="span" variant="caption" color="textSecondary">
          {parent}
        </Typography>
      )}
    </Box>
  );
};

LocationName.propTypes = {};

export default LocationName;
