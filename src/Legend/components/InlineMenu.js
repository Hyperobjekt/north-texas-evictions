import React, { useMemo } from "react";
import { Menu, MenuItem, styled, Typography } from "@material-ui/core";
import { FOCUS_STATE } from "../../theme";

function uuid(a) {
  return a
    ? (a ^ ((Math.random() * 16) >> (a / 4))).toString(16)
    : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid);
}

const InlineMenuButton = styled("button")({
  background: "none",
  border: 0,
  padding: 0,
  margin: 0,
  borderRadius: 1,
  display: "inline-block",
  verticalAlign: "top",
  fontWeight: 500,
  cursor: "pointer",
  "&:hover": {
    textDecoration: "underline",
  },
  "&:focus": {
    ...FOCUS_STATE,
    outline: "none",
  },
});

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