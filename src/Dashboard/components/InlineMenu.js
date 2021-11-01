import React, { useMemo } from "react";
import { Menu, MenuItem, styled, Typography } from "@material-ui/core";
import { FOCUS_STATE } from "../../theme";
import { ArrowDropDown } from "@material-ui/icons";
// import { useLang } from "../../Language";

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
  fontSize: "inherit",
  cursor: "pointer",
  whiteSpace: "nowrap",
  textShadow: "0px 1px 1px rgba(255,255,255,1)",
  "&:hover": {
    textDecoration: "underline",
  },
  "&:focus": {
    ...FOCUS_STATE,
    outline: "none",
  },
});

const InlineMenu = ({ children, options, selected, onSelect, ...props }) => {
  const id = useMemo(uuid, []);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const unavailableOptions = options.filter((o) => o.unavailable);
  // const unavailableLabel = useLang("LABEL_UNAVAILABLE");

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
        {children}{" "}
        <ArrowDropDown style={{ margin: "-0.75em -0.25em -0.3em -0.15em" }} />
      </Typography>
      <Menu
        id={id}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {options
          .filter((o) => !o.unavailable)
          .map((option, i) => (
            <MenuItem
              key={option.id}
              selected={option.active || selected === option.id}
              onClick={(e) => handleClose(e, option)}
            >
              <span style={{ textTransform: "capitalize" }}>
                {option?.label ? option.label : option}{" "}
              </span>
            </MenuItem>
          ))}
        {/* {unavailableOptions.length > 0 && (
          <ListSubheader>{unavailableLabel}</ListSubheader>
        )} */}
        {unavailableOptions.map((option, i) => (
          <MenuItem key={option.id} disabled>
            <span style={{ textTransform: "capitalize" }}>
              {option?.label ? option.label : option}
            </span>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

InlineMenu.propTypes = {};

export default InlineMenu;
