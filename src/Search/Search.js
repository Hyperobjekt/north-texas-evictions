import React from "react";
import {
  Input,
  InputAdornment,
  makeStyles,
  withStyles,
} from "@material-ui/core";
import SearchIcon from "../Icons/SearchIcon";
import useSearchData from "./hooks/useSearchData";
import Autocomplete from "@material-ui/lab/Autocomplete";
import clsx from "clsx";
import useActivateSearchResult from "./hooks/useActivateSearchResult";

const SearchInput = withStyles((theme) => ({
  root: {
    marginLeft: "auto",
    height: 42,
    paddingRight: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      borderRadius: 0,
    },
  },
}))(Input);

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 280,
    marginLeft: "auto",
    marginRight: 0,
    [theme.breakpoints.down("sm")]: {
      position: "absolute",
      top: 64,
      left: 0,
      right: 0,
      maxWidth: "none",
      marginLeft: `0!important`,
    },
    '& .MuiAutocomplete-inputRoot[class*="MuiInput-root"] .MuiAutocomplete-input':
      {
        padding: `0.2rem 0.5rem 0`,
      },
    "&.MuiAutocomplete-hasPopupIcon.MuiAutocomplete-hasClearIcon .MuiAutocomplete-inputRoot":
      {
        paddingRight: "3rem",
      },
    // add spacing to the element beside the input (if any)
    "& + *": {
      marginLeft: theme.spacing(2),
    },
  },
  clearIndicator: {
    visibility: "visible",
  },
  popupIndicator: {
    display: "none",
  },
  endAdornment: {
    right: "0.75rem",
  },
  input: {
    height: 42,
    [theme.breakpoints.down("sm")]: {
      height: 48,
    },
  },
  groupLabel: {
    textTransform: "capitalize",
  },
  hideClear: {
    "& .MuiAutocomplete-clearIndicator": {
      visibility: "hidden",
    },
  },
}));

const Search = (props) => {
  const { status, data } = useSearchData();

  const classes = useStyles();
  const options = data || [];
  const activateSearchResult = useActivateSearchResult();

  /**
   * Updates the selected region and flies to the selected location.
   * @param {*} event
   * @param {*} value
   * @param {*} reason
   * @returns
   */
  const handleChange = (event, value, reason) => {
    if (reason !== "select-option") return;
    activateSearchResult(value);
  };

  return (
    <Autocomplete
      id="location-search"
      options={options.sort((a, b) => -b.region.localeCompare(a.region))}
      groupBy={(option) => option.region}
      getOptionLabel={(option) => option.name}
      loading={status === "loading"}
      fullWidth={false}
      onChange={handleChange}
      clearOnEscape={true}
      classes={{
        root: classes.root,
        clearIndicator: classes.clearIndicator,
        popupIndicator: classes.popupIndicator,
        groupLabel: classes.groupLabel,
        endAdornment: classes.endAdornment,
        inputRoot: classes.input,
      }}
      renderInput={({ id, InputProps, inputProps, fullWidth }) => {
        return (
          <SearchInput
            {...{
              id,
              ...InputProps,
              inputProps,
              fullWidth,
              className: clsx("dark", InputProps.className, classes.input, {
                [classes.hideClear]: !inputProps.value,
              }),
              placeholder: "search",
              startAdornment: (
                <InputAdornment
                  className={classes.inputAdornmentStart}
                  position="start"
                >
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        );
      }}
      {...props}
    />
  );
};

Search.propTypes = {};

export default Search;
