import React from "react";
import { ListSubheader, TextField } from "@material-ui/core";
import { MenuItem } from "@material-ui/core";
import { useLang } from "../../Language";
import useDashboardChoropleth from "../hooks/useDashboardChoropleth";

const ChoroplethSelect = (props) => {
  const [activeChoropleth, setActiveChoropleth, options] =
    useDashboardChoropleth();
  const unavailableOptions = options.filter((o) => o.unavailable);
  const handleChange = (event) => {
    setActiveChoropleth(event.target.value);
  };
  const label = useLang("SELECT_CHOROPLETH");
  const unavailableLabel = useLang("LABEL_UNAVAILABLE");
  const isReady = options.length > 0 && activeChoropleth;
  return (
    isReady && (
      <TextField
        id="choropleth-select"
        select
        label={label}
        value={activeChoropleth}
        onChange={handleChange}
        {...props}
      >
        {options
          .filter((o) => !o.unavailable)
          .map((metric, i) => (
            <MenuItem key={metric.id} value={metric.id}>
              {metric.label}
            </MenuItem>
          ))}
        {unavailableOptions.length > 0 && (
          <ListSubheader>{unavailableLabel}</ListSubheader>
        )}
        {unavailableOptions.map((metric, i) => (
          <MenuItem key={metric.id} value={metric.id} disabled>
            {metric.label}
          </MenuItem>
        ))}
      </TextField>
    )
  );
};

ChoroplethSelect.propTypes = {};

export default ChoroplethSelect;
