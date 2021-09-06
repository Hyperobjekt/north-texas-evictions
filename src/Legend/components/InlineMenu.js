import React, { useMemo } from "react";
import {
  ButtonBase,
  Menu,
  MenuItem,
  Typography,
  withStyles,
} from "@material-ui/core";

function uuid(a) {
  return a
    ? (a ^ ((Math.random() * 16) >> (a / 4))).toString(16)
    : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid);
}

const InlineMenuButton = withStyles({
  root: {
    verticalAlign: "top",
    fontWeight: 500,
  },
})(ButtonBase);

const InlineMenu = ({ children, options, onSelect, ...props }) => {
  const id = useMemo(uuid, []);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (e, option) => {
    setAnchorEl(null);
    onSelect && onSelect(e, option);
  };
  return (
    <>
      <Typography
        aria-controls={id}
        aria-haspopup="true"
        component={InlineMenuButton}
        onClick={handleClick}
        {...props}
      >
        {children}
      </Typography>
      <Menu
        id={id}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {options.map((option) => (
          <MenuItem key={option.key} onClick={(e) => handleClose(e, option)}>
            {option?.label ? option.label : option}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

InlineMenu.propTypes = {};

export default InlineMenu;
