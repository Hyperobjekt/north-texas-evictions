import React from "react";
import { Header as HypHeader, Stack } from "@hyperobjekt/material-ui-website";
import { Box } from "@material-ui/core";
import Branding from "./Branding";

const Header = ({ children, ...props }) => {
  return (
    <HypHeader stickyOffset={0} elevation={1} {...props}>
      <Box
        px={[2, 3]}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        flex={1}
      >
        <Branding />
        <Stack
          around="none"
          between="sm"
          ml="auto"
          flex={1}
          justifyContent="flex-end"
        >
          {children}
        </Stack>
      </Box>
    </HypHeader>
  );
};

export default Header;
