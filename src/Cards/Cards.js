import React from "react";
import { Stack } from "@hyperobjekt/material-ui-website";
import MapTextControlsCard from "./components/MapTextControlsCard";
import MapLegendCard from "./components/MapLegendCard";
import EvictionSummaryCard from "./components/EvictionSummaryCard";
import LocationsCard from "../Locations/components/LocationsCard";
import { DataFlags, useDataFlags } from "../Flags";
import { useDashboardStore } from "../Dashboard";
const Cards = (props) => {
  const flags = useDataFlags();
  const activeView = useDashboardStore((state) => state.activeView);
  const cards =
    activeView === "map"
      ? [
          <MapTextControlsCard key="map-text-controls" />,
          <MapLegendCard key="map-legend" />,
          <EvictionSummaryCard key="eviction-summary" />,
          <LocationsCard key="locations" />,
        ]
      : [
          <EvictionSummaryCard key="eviction-summary" />,
          <LocationsCard key="locations" />,
        ];
  return (
    <Stack
      direction="vertical"
      between="md"
      around="none"
      alignItems="stretch"
      {...props}
    >
      <DataFlags flags={flags} />
      {cards}
    </Stack>
  );
};

Cards.propTypes = {};

export default Cards;
