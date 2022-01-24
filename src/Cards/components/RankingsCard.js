import React from "react";
import { Box, List, ListItem, Typography } from "@material-ui/core";
import {
  Card,
  useDashboardStore,
  useFormatter,
  formatDateString,
} from "../../Dashboard";
import { useLang } from "../../Language";
import { LocationName } from "../../Locations";
import { useMapStore } from "@hyperobjekt/mapbox";
import useMapSources from "../../Map/hooks/useMapSources";

/**
 * Shows a summary of the eviction data, including the number of evictions,
 * trend line, and summary of stats.
 */
const RankingsCard = (props) => {
  // pull required data from map sources
  const sources = useMapSources();
  const bubbleSource = sources?.find(
    (source) => source.id.indexOf("bubble") > -1
  );
  const choroplethSource = sources?.find(
    (source) => source.id.indexOf("choropleth") > -1
  );
  const activeBubble = useDashboardStore((state) => state.activeBubble);
  const activeRegion = useDashboardStore((state) => state.activeRegion);
  const setHoverCoords = useDashboardStore((state) => state.setHoverCoords);
  const [setHoveredFeature, setSelectedFeature] = useMapStore((state) => [
    state.setHoveredFeature,
    state.setSelectedFeature,
  ]);
  // pull current date range
  const dateRange = useDashboardStore((state) => state.activeDateRange);
  const dateRangeLabel = formatDateString(...dateRange, { short: true }).join(
    " - "
  );
  // get summary card language
  const metricLabel = useLang(`METRIC_${activeBubble}`);
  const valueFormatter = useFormatter(activeBubble);
  const regionLabel = useLang(`REGION_${activeRegion}`);
  // pull the top locations for the current metric
  const topLocations = bubbleSource?.data?.features
    ?.sort((a, b) => {
      if (!a?.properties?.[activeBubble]) return 1;
      if (!b?.properties?.[activeBubble]) return -1;
      return b.properties[activeBubble] - a.properties[activeBubble];
    })
    .slice(0, 5);

  // set hovered location when hovering locations in the list
  const handleHover = (location) => (event) => {
    if (!location) setHoveredFeature(null);
    const choroFeature = choroplethSource?.data?.features?.find(
      (f) => f?.properties?.id === location?.properties?.id
    );
    if (!choroFeature) return;

    setHoveredFeature({
      ...choroFeature,
      source: `${activeRegion}-choropleth`,
      layer: { source: `${activeRegion}-choropleth` },
    });
    setHoverCoords([640, event.pageY]);
  };
  // activate a location when clicking
  const handleSelect = (location) => (event) => {
    if (!location) return;
    const choroFeature = choroplethSource?.data?.features?.find(
      (f) => f?.properties?.id === location?.properties?.id
    );
    choroFeature &&
      setSelectedFeature({
        ...choroFeature,
        source: `${activeRegion}-choropleth`,
        layer: { source: `${activeRegion}-choropleth` },
      });
  };
  return (
    <Card title={`Eviction Hotspots`} {...props}>
      <Box mt={-1} mb={2}>
        <Typography variant="caption" component="h2" color="textSecondary">
          Top <strong>{regionLabel}</strong> by <strong>{metricLabel}</strong>
          <br />
          from <strong>{dateRangeLabel}</strong>
        </Typography>
      </Box>
      <Box ml={-2} mr={-2} width="calc(100% + 2rem)">
        <List disablePadding>
          {topLocations?.map((location) => (
            <ListItem
              button
              key={location.properties.name}
              onMouseEnter={handleHover(location)}
              onMouseLeave={handleHover(null)}
              onClick={handleSelect(location)}
            >
              <LocationName name={location.properties.name} />
              <Box ml="auto">
                <Typography variant="h2">
                  {valueFormatter(location.properties?.[activeBubble])}
                </Typography>
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>
    </Card>
  );
};

export default RankingsCard;
