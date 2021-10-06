import React from "react";
import { Stack } from "@hyperobjekt/material-ui-website";
import CurrentViewCard from "./components/CurrentViewCard";
import MapLegendCard from "./components/MapLegendCard";
import EvictionSummaryCard from "./components/EvictionSummaryCard";
import LocationsCard from "../Locations/components/LocationsCard";
import { DataFlags, useDataFlags } from "../Flags";
const Cards = (props) => {
  const flags = useDataFlags();
  return (
    <Stack
      direction="vertical"
      between="md"
      around="none"
      alignItems="stretch"
      {...props}
    >
      <DataFlags flags={flags} />
      <CurrentViewCard />
      <MapLegendCard />
      <EvictionSummaryCard />
      <LocationsCard />
    </Stack>
  );
};

Cards.propTypes = {};

export default Cards;
