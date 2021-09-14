import useDashboardContext from "../../Dashboard/hooks/useDashboardContext";
import useDashboardStore from "../../Dashboard/hooks/useDashboardStore";
import useDebouncedViewport from "../../Dashboard/hooks/useDebouncedViewport";
import useRouter from "../../Router/useRouter";
import { populateRoute, ROUTE_TEMPLATE, validateRoute } from "../router";

/**
 * Serves as an initiator for the routing functionality.  Using the hooks
 * cause re-renders of any child components on change, so for performance
 * it's best to keep this in a component that doesn't render anything.
 */
const Router = () => {
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
  // start routing
  useRouter(ROUTE_TEMPLATE, values, populateRoute, validateRoute);
  // do not render anything!
  return null;
};

export default Router;
