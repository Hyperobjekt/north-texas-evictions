import React from "react";
import { TextField } from "@material-ui/core";
import { MenuItem } from "@material-ui/core";
import { useLang } from "../../Language";
import usePrecinctFilter from "../../Data/usePrecinctFilter";
import usePrecinctNames from "../../Data/usePrecinctNames";

const CourtSelect = (props) => {
  const allPrecincts = usePrecinctNames();
  const [precinct, setPrecinct] = usePrecinctFilter();
  const isReady = Object.keys(allPrecincts).length > 0;
  const [courtSelectLabel, allCourtsLabel] = useLang([
    "SELECT_COURT",
    "LABEL_ALL_COURTS",
  ]);
  const handleChange = (e) => {
    const value = e.target.value;
    // if the value is "all", clear the precinct
    setPrecinct(value === "all" ? null : value);
  };
  return isReady ? (
    <TextField
      id="court-select"
      select
      label={courtSelectLabel}
      value={precinct ? `${precinct}` : "all"}
      onChange={handleChange}
      {...props}
    >
      <MenuItem value="all">{allCourtsLabel}</MenuItem>
      {Object.entries(allPrecincts).map(([id, name], i) => (
        <MenuItem key={id} value={`${id}`}>
          {name}
        </MenuItem>
      ))}
    </TextField>
  ) : null;
};

CourtSelect.propTypes = {};

export default CourtSelect;
