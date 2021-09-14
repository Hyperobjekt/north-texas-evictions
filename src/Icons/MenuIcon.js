import React from "react";
import { SvgIcon } from "@material-ui/core";

const MenuIcon = (props) => {
  return (
    <SvgIcon {...props}>
      <path d="M3 8H21V10H3V8Z" />
      <path d="M8 13H21V15H8V13Z" />
    </SvgIcon>
  );
};

export default MenuIcon;
