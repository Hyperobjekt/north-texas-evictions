import React, { useLayoutEffect } from "react";
import MapLegendCard from "../Map/components/MapLegendCard";
import EvictionSummaryCard from "./components/EvictionSummaryCard";
import LocationsCard from "../Locations/components/LocationsCard";
import { DataFlags, useDataFlags } from "../Flags";
import { useDashboardStore } from "../Dashboard";
import { animated, useSpring } from "react-spring";
import { Box } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import useMediaQueries from "../App/hooks/useMediaQueries";
import RankingsCard from "./components/RankingsCard";

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
  const { isMobile } = useMediaQueries();
  const style = useSpring({
    opacity: active ? 1 : 0,
    x: active ? 0 : -324,
    delay: active ? 100 : 0,
  });

  // scroll the map legend into view when activated
  useLayoutEffect(() => {
    setTimeout(() => {
      isMobile && active && window.scroll(0, 64);
    }, 1000);
  }, [active, isMobile]);

  return (
    <StyledStack
      display="flex"
      flexDirection="column"
      alignItems="stretch"
      style={{
        ...style,
        // set styles when completely off screen
        position: style["opacity"].to((val) =>
          Math.abs(val) === 1 ? "relative" : "absolute"
        ),
        visibility: style["opacity"].to((val) =>
          Math.abs(val) === 0 ? "hidden" : "visible"
        ),
        maxHeight: style["opacity"].to((val) =>
          Math.abs(val) === 0 ? "60vh" : "none"
        ),
        overflow: style["opacity"].to((val) =>
          Math.abs(val) === 0 ? "hidden" : "visible"
        ),
      }}
      {...props}
    >
      <MapLegendCard />
      <LocationsCard />
      <EvictionSummaryCard />
      <RankingsCard />
    </StyledStack>
  );
};

const TimeSeriesCards = ({ active, ...props }) => {
  const { isMobile } = useMediaQueries();

  const style = useSpring({
    opacity: active ? 1 : 0,
    x: active ? 0 : -324,
    delay: active ? 100 : 0,
  });

  // scroll the legend into view when activated
  useLayoutEffect(() => {
    setTimeout(() => {
      isMobile && active && window.scroll(0, 24);
    }, 1000);
  }, [active, isMobile]);

  return (
    <StyledStack
      display="flex"
      flexDirection="column"
      alignItems="stretch"
      style={{
        ...style,
        // set styles when completely off screen
        position: style["opacity"].to((val) =>
          Math.abs(val) === 1 ? "relative" : "absolute"
        ),
        visibility: style["opacity"].to((val) =>
          Math.abs(val) === 0 ? "hidden" : "visible"
        ),
        maxHeight: style["opacity"].to((val) =>
          Math.abs(val) === 0 ? "80vh" : "none"
        ),
        overflow: style["opacity"].to((val) =>
          Math.abs(val) === 0 ? "hidden" : "visible"
        ),
      }}
      {...props}
    >
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
