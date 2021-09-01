import React from "react";
import {
  IconButton,
  Input,
  InputAdornment,
  withStyles,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";

const SearchInput = withStyles((theme) => ({
  root: {
    marginLeft: "auto",
    marginRight: theme.spacing(2),
    height: 42,
  },
}))(Input);

const Search = (props) => {
  const handleClear = () => {
    console.log("clear");
  };
  return (
    <SearchInput
      startAdornment={
        <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
      }
      endAdornment={
        props.value && (
          <InputAdornment position="end">
            <IconButton onClick={handleClear}>
              <CloseIcon />
            </IconButton>
          </InputAdornment>
        )
      }
      {...props}
    />
  );
};

Search.propTypes = {};

export default Search;
