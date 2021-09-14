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
import { useFlyToLatLon } from "@hyperobjekt/mapbox";
import useDashboardRegion from "../Dashboard/hooks/useDashboardRegion";

const SearchInput = withStyles((theme) => ({
  root: {
    marginLeft: "auto",
    height: 42,
    paddingRight: theme.spacing(2),
  },
}))(Input);

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 280,
    marginLeft: "auto",
    marginRight: 0,
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

// maps region to zoom levels when flying to a location
const ZOOM_LEVELS = {
  tracts: 15,
  cities: 12,
  zips: 12,
  counties: 9,
  districts: 14,
};

const Search = (props) => {
  const { status, data } = useSearchData();
  const flyToLatLon = useFlyToLatLon();
  const [activeRegion, setActiveRegion] = useDashboardRegion();
  const classes = useStyles();
  const options = data || [];

  /**
   * Updates the selected region and flies to the selected location.
   * @param {*} event
   * @param {*} value
   * @param {*} reason
   * @returns
   */
  const handleChange = (event, value, reason) => {
    if (reason !== "select-option") return;
    if (value.point && value.region) {
      value.region !== activeRegion && setActiveRegion(value.region);
      flyToLatLon(
        value.point[1],
        value.point[0],
        ZOOM_LEVELS[value.region] || 10
      );
    }
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
