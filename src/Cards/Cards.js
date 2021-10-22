import React from "react";
import { Stack } from "@hyperobjekt/material-ui-website";
import MapLegendCard from "../Map/components/MapLegendCard";
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
          <MapLegendCard key="map-legend" />,
          <LocationsCard key="locations" />,
          <EvictionSummaryCard key="eviction-summary" />,
        ]
      : [
          <LocationsCard key="locations" />,
          <EvictionSummaryCard key="eviction-summary" />,
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
