import useDashboardContext from "../../Dashboard/hooks/useDashboardContext";
import useDashboardStore from "../../Dashboard/hooks/useDashboardStore";
import useDebouncedViewport from "../../Dashboard/hooks/useDebouncedViewport";
import useRouter from "../../Router/useRouter";
import { populateRoute, ROUTE_TEMPLATE, validateRoute } from "../router";

export default function useAppRouter() {
  // pull current dashboard values from the store
  const context = useDashboardContext();
  const isReady = useDashboardStore((state) => state.ready);
  const { latitude, longitude, zoom } = useDebouncedViewport();
  const values = isReady
    ? {
        activeRegion: context?.activeRegion,
        activeBubble: context?.activeBubble,
        activeChoropleth: context?.activeChoropleth,
        start: context?.activeDateRange[0],
        end: context?.activeDateRange[1],
        zoom,
        latitude,
        longitude,
        precinct: context?.filters.find((f) => f[0] === "precinct")?.[1],
      }
    : null;
  useRouter(ROUTE_TEMPLATE, values, populateRoute, validateRoute);
}
