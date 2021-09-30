import React from "react";
import { Header as HypHeader } from "@hyperobjekt/material-ui-website";
import { Box, List, ListItem } from "@material-ui/core";
import Menu from "./Menu";
import MenuIcon from "../../Icons/MenuIcon";
import Branding from "./Branding";
import useMediaQueries from "../hooks/useMediaQueries";
import InfoModal from "./InfoModal";

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
        <InfoModal />
        {process.env.NODE_ENV !== "production" && (
          <Menu
            buttonLabel={
              <>
                <MenuIcon style={{ marginRight: 4 }} /> {!isMobile && "Menu"}
              </>
            }
            style={{ marginLeft: 16 }}
          >
            <List>
              <ListItem button href="#">
                Option
              </ListItem>
            </List>
          </Menu>
        )}
      </Box>
    </HypHeader>
  );
};

export default Header;
