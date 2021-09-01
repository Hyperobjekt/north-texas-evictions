import React from "react";
import useDashboardStore from "../hooks/useDashboardStore";
import { TextField } from "@material-ui/core";
import { MenuItem } from "@material-ui/core";
import { useLang } from "../../Language";
import shallow from "zustand/shallow";

const RegionSelect = (props) => {
  const [regions, activeRegion, setActiveRegion] = useDashboardStore(
    (state) => [state.regions, state.activeRegion, state.setActiveRegion],
    shallow
  );
  const label = useLang(`SELECT_REGION`);
  const regionLabels = useLang(regions.map((region) => `REGION_${region.id}`));
  const handleRegionChange = (event) => {
    setActiveRegion(event.target.value);
  };
  const isReady = regions.length > 0 && activeRegion;
  return (
    isReady && (
      <TextField
        id="region-select"
        select
        label={label}
        value={activeRegion}
        onChange={handleRegionChange}
      >
        {regions.map((region, i) => (
          <MenuItem key={region.id} value={region.id}>
            {regionLabels[i]}
          </MenuItem>
        ))}
      </TextField>
    )
  );
};

RegionSelect.propTypes = {};

export default RegionSelect;
