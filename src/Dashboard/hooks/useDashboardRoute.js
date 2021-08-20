import useDashboardContext from "./useDashboardContext";

/**
 * Returns an object that contains the dashboard route query params string,
 * and a parser function.
 * @returns { route: string, parseRoute: function }
 */
export default function useDashboardRoute() {
  const context = useDashboardContext();
  const {
    activeRegion: region,
    activeBubble: bubble,
    activeChoropleth: choropleth,
    activeDateRange: [start, end],
  } = context;
  return {
    route: new URLSearchParams({
      region,
      bubble,
      choropleth,
      start,
      end,
    }).toString(),
    // TODO: provide better parser that validates params are correct
    parseRoute: (routeString) => new URLSearchParams(routeString).entries,
  };
}
