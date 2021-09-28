import React from "react";
import { Paper, Box, Typography } from "@material-ui/core";

const Card = ({ title, noPadding = false, children, ...props }) => {
  const topRow =
    typeof title === "string" ? (
      <Typography variant="overline" color="textSecondary">
        {title}
      </Typography>
    ) : (
      title
    );
  return (
    <Paper
      elevation={1}
      style={{ borderRadius: 8, border: `1px solid #e6e6e6` }}
      {...props}
    >
      <Box p={2} pb={1}>
        {topRow}
      </Box>
      <Box p={noPadding ? 0 : 2} pt={noPadding ? 0 : 1}>
        {children}
      </Box>
    </Paper>
  );
};

export default Card;
