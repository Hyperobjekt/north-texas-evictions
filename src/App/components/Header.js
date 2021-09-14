import React from "react";
import { Header as HypHeader } from "@hyperobjekt/material-ui-website";
import { Box, List, ListItem } from "@material-ui/core";
import Menu from "./Menu";
import MenuIcon from "@material-ui/icons/Menu";
import Branding from "./Branding";
import useMediaQueries from "../hooks/useMediaQueries";

const Header = ({ children, ...props }) => {
  const { isMobile } = useMediaQueries();

  return (
    <HypHeader stickyOffset={0} elevation={1} {...props}>
      <Box
        px={[2, 3]}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        flex={1}
      >
        {!isMobile && <Branding />}
        {children}
        <Menu
          buttonLabel={
            <>
              <MenuIcon /> {!isMobile && "Menu"}
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
