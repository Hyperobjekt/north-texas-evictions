import React from "react";
import PropTypes from "prop-types";
import { Header as HypHeader } from "@hyperobjekt/material-ui-website";
import { Box, List, ListItem, Typography } from "@material-ui/core";
import Menu from "./Menu";
import MenuIcon from "@material-ui/icons/Menu";

const Header = ({ children, ...props }) => {
  return (
    <HypHeader {...props}>
      <Box
        px={[2, 3]}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        flex={1}
      >
        <Typography>Branding</Typography>
        {children}
        <Menu
          buttonLabel={
            <>
              <MenuIcon /> Menu
            </>
          }
        >
          <List>
            <ListItem button href="#">
              Option
            </ListItem>
          </List>
        </Menu>
      </Box>
    </HypHeader>
  );
};

export default Header;
