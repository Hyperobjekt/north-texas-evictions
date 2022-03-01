import { useMemo } from "react";
import { useDashboardRegion } from "../../Dashboard";
import { useBubblesData, useChoroplethData } from "../../Data";
import { usePinnedSource } from "../../Locations";

export default function useMapSources() {
  const bubble = useBubblesData();
  const choropleth = useChoroplethData();
  const [activeRegion, , regions] = useDashboardRegion();
  const region = regions.find((r) => r.id === activeRegion);
  const pinned = usePinnedSource();

  return useMemo(() => {
    const data = { bubble, choropleth };
    const regionSources = region
      ? Object.entries(data)
          .filter(([key, { status }]) => status === "success")
          .map(([key, { data }]) => ({
            id: `${region.id}-${key}`,
            type: "geojson",
            data: data.geojson,
          }))
      : [];
    return [...regionSources, pinned];
  }, [region, bubble, choropleth, pinned]);
}
