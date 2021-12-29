import { Button, ButtonGroup, Typography } from "@material-ui/core";
import React from "react";
import TimeComparisonChart from "./components/TimeComparisonChart";
import TimeComparisonToggle from "./components/TimeComparisonToggle";
import useComparisonLines from "./hooks/useComparisonLines";

export const TimeComparison = (feature) => {
  const [view, setView] = React.useState("count");
  const colors = ['#f00', '#0f0', '#00f'];
  const lines = useComparisonLines([2019, 2020, 2021], colors);
  const handleToggleView = (view) => (e) => {
    setView(view);
  };

  return (
    <>
      <Typography variant="overline" color="textSecondary">
        Pre-COVID vs. COVID-19 Era
      </Typography>
      {/* <TimeComparisonToggle /> */}
      <ButtonGroup>
        <Button
          color={view === "count" && "primary"}
          onClick={handleToggleView("count")}
        >
          Counts
        </Button>
        <Button
          color={view === "relative" && "primary"}
          onClick={handleToggleView("relative")}
        >
          Relative
        </Button>
      </ButtonGroup>
      <TimeComparisonChart lines={lines} />
    </>
  );
};

export default TimeComparison;
