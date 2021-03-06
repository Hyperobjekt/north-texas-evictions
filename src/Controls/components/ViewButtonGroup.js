import React from "react";
import { Button, ButtonGroup, styled, withStyles } from "@material-ui/core";
import { useDashboardStore } from "../../Dashboard";
import clsx from "clsx";
import shallow from "zustand/shallow";
import { useLocationStore } from "../../Locations";
import { MapIcon, TimeSeriesIcon } from "../../Icons";

const iconStyles = {
  fontSize: 20,
  marginRight: 8,
};

const StyledMapIcon = styled(MapIcon)(iconStyles);

const StyledTimeSeriesIcon = styled(TimeSeriesIcon)(iconStyles);

const DarkButtonGroup = withStyles((theme) => ({
  root: {
    backgroundColor: "#292929",
    color: "#fff",
    [theme.breakpoints.down("xs")]: {
      position: "absolute",
      left: 16,
    },
  },
  groupedContained: {
    height: 42,
    whiteSpace: "nowrap",
    "&.active": {
      backgroundColor: "#3B5157",
      boxShadow: "inset 0 0 0 1px #649BA6",
    },
  },
  groupedContainedHorizontal: {
    "&:not(:last-child)": {
      borderRight: "1px solid #292929",
    },
  },
}))(ButtonGroup);

const ViewButtonGroup = (props) => {
  const [activeView, setActiveView] = useDashboardStore(
    (state) => [state.activeView, state.setActiveView],
    shallow
  );
  const [activeLocation, setActiveLocation] = useLocationStore(
    (state) => [state.active, state.setActive],
    shallow
  );
  const handleChangeView = (view) => {
    return (e) => {
      if (activeLocation) setActiveLocation(null);
      setActiveView(view);
    };
  };
  return (
    <DarkButtonGroup variant="contained">
      <Button
        className={clsx("dark", { active: activeView === "map" })}
        onClick={handleChangeView("map")}
      >
        <StyledMapIcon /> Map
      </Button>
      <Button
        className={clsx("dark", { active: activeView === "series" })}
        onClick={handleChangeView("series")}
      >
        <StyledTimeSeriesIcon /> Time Series
      </Button>
    </DarkButtonGroup>
  );
};

export default ViewButtonGroup;
