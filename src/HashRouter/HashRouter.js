import { useMapViewport } from "@hyperobjekt/mapbox/lib/hooks";
import { useDashboardContext, useDashboardStore } from "../Dashboard";
import { ROUTE_TEMPLATE } from "./constants";
import useHashRouter from "./useHashRouter";
import { populateRoute, validateRoute } from "./utils";

const round = (value, decimals = 3) => {
  return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
};

/**
 * Serves as an initiator for the routing functionality.  Using the hooks
 * cause re-renders of any child components on change, so for performance
 * it's best to keep this in a component that doesn't render anything.
 */
const HashRouter = () => {
  // pull current dashboard values from the store
  const context = useDashboardContext();
  const isReady = useDashboardStore((state) => state.ready);
  const [{ latitude, longitude, zoom }] = useMapViewport();
  const values = isReady
    ? {
        activeRegion: context?.activeRegion,
        activeBubble: context?.activeBubble,
        activeChoropleth: context?.activeChoropleth,
        start: context?.activeDateRange[0],
        end: context?.activeDateRange[1],
        zoom: round(zoom),
        latitude: round(latitude),
        longitude: round(longitude),
      }
    : null;
  // start routing
  useHashRouter(ROUTE_TEMPLATE, values, populateRoute, validateRoute);
  // do not render anything!
  return null;
};

export default HashRouter;
