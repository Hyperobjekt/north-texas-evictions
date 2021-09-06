import { useMemo } from "react";
import useDashboardRegion from "../../Dashboard/hooks/useDashboardRegion";
import useBubblesData from "../../Data/useBubblesData";
import useChoroplethData from "../../Data/useChoroplethData";

export default function useMapSources() {
  const bubble = useBubblesData();
  const choropleth = useChoroplethData();
  const [activeRegion, , regions] = useDashboardRegion();
  const region = regions.find((r) => r.id === activeRegion);
  return useMemo(() => {
    const data = { bubble, choropleth };
    return region
      ? Object.entries(data)
          .filter(([key, { status }]) => status === "success")
          .map(([key, { data }]) => ({
            id: `${region.id}-${key}`,
            type: "geojson",
            data: data.geojson,
          }))
      : [];
  }, [region, bubble, choropleth]);
}
