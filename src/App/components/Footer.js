import React from "react";
import { Box, Typography } from "@material-ui/core";

const Footer = (props) => {
  return (
    <Box p={2} borderTop={1} borderColor="divider">
      <Typography variant="body2">Footer</Typography>
    </Box>
  );
};

Footer.propTypes = {};

export default Footer;
