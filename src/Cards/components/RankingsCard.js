import React from "react";
import { List, ListItem, Typography } from "@material-ui/core";
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
  // pull the top locations for the current metric
  const topLocations = bubbleSource?.data?.features
    ?.sort(
      (a, b) => b.properties?.[activeBubble] - a.properties?.[activeBubble]
    )
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
    setHoverCoords([400, event.pageY]);
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
      <Typography
        variant="caption"
        component="h2"
        color="textSecondary"
        style={{ marginTop: "-0.5rem", marginBottom: "1rem" }}
      >
        By {metricLabel} from <br /> {dateRangeLabel}
      </Typography>
      <List
        disablePadding
        style={{
          marginLeft: -16,
          marginRight: -16,
          width: `calc(100% + 32px)`,
        }}
      >
        {topLocations?.map((location) => (
          <ListItem
            button
            key={location.properties.name}
            onMouseEnter={handleHover(location)}
            onMouseLeave={handleHover(null)}
            onClick={handleSelect(location)}
          >
            <LocationName name={location.properties.name} />
            <Typography variant="h2" style={{ marginLeft: "auto" }}>
              {valueFormatter(location.properties?.[activeBubble])}
            </Typography>
          </ListItem>
        ))}
      </List>
    </Card>
  );
};

export default RankingsCard;
