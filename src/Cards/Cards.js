import React from "react";
import MapLegendCard from "../Map/components/MapLegendCard";
import EvictionSummaryCard from "./components/EvictionSummaryCard";
import LocationsCard from "../Locations/components/LocationsCard";
import { DataFlags, useDataFlags } from "../Flags";
import { useDashboardStore } from "../Dashboard";
import { animated, useSpring } from "react-spring";
import { Box } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";

const AnimatedStack = animated(Box);

const StyledStack = withStyles((theme) => ({
  root: {
    width: "100%",
    "& > *": {
      marginBottom: theme.spacing(2),
      "&:last-child": {
        marginBottom: 0,
      },
    },
  },
}))(AnimatedStack);

const MapCards = ({ active, ...props }) => {
  const style = useSpring({
    opacity: active ? 1 : 0,
    x: active ? 0 : -324,
    delay: active ? 100 : 0,
  });

  // TODO: evaluate if needed, if so implement in a way that works on iOS safari
  // scroll the map legend into view when activated
  // useLayoutEffect(() => {
  //   setTimeout(() => {
  //     var element = document.getElementById("mapLegendScroll");
  //     element &&
  //       active &&
  //       element.scrollIntoView({
  //         behavior: "smooth",
  //         block: "end",
  //         inline: "nearest",
  //       });
  //   }, 600);
  // }, [active]);

  return (
    <StyledStack
      display="flex"
      flexDirection="column"
      alignItems="stretch"
      style={{
        ...style,
        position: style["opacity"].to((val) =>
          Math.abs(val) === 1 ? "relative" : "absolute"
        ),
        visibility: style["opacity"].to((val) =>
          Math.abs(val) === 0 ? "hidden" : "visible"
        ),
      }}
      {...props}
    >
      <MapLegendCard />
      {/* <a id="mapLegendScroll" style={{ marginBottom: 0 }} /> */}
      <LocationsCard />
      <EvictionSummaryCard />
    </StyledStack>
  );
};

const TimeSeriesCards = ({ active, ...props }) => {
  const style = useSpring({
    opacity: active ? 1 : 0,
    x: active ? 0 : -324,
    delay: active ? 100 : 0,
  });

  // TODO: evaluate if needed, if so implement in a way that works on iOS safari
  // scroll the map legend into view when activated
  // useLayoutEffect(() => {
  //   setTimeout(() => {
  //     var element = document.getElementById("seriesLegendScroll");
  //     element &&
  //       active &&
  //       element.scrollIntoView({
  //         behavior: "smooth",
  //         block: "end",
  //         inline: "nearest",
  //       });
  //   }, 600);
  // }, [active]);

  return (
    <StyledStack
      display="flex"
      flexDirection="column"
      alignItems="stretch"
      style={{
        ...style,
        position: style["opacity"].to((val) =>
          Math.abs(val) === 1 ? "relative" : "absolute"
        ),
        visibility: style["opacity"].to((val) =>
          Math.abs(val) === 0 ? "hidden" : "visible"
        ),
      }}
      {...props}
    >
      {/* <a id="seriesLegendScroll" style={{ marginBottom: 0 }} /> */}
      <LocationsCard />
      <EvictionSummaryCard />
    </StyledStack>
  );
};

const Cards = () => {
  const flags = useDataFlags();
  const activeView = useDashboardStore((state) => state.activeView);

  return (
    <>
      <DataFlags flags={flags} />
      <Box position="relative" display="flex" flexDirection="row-reverse">
        <MapCards active={activeView === "map"} />
        <TimeSeriesCards active={activeView === "series"} />
      </Box>
    </>
  );
};

Cards.propTypes = {};

export default Cards;
