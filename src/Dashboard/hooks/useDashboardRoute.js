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
    getCurrentParams: () => {
      if (!window?.location?.search) return null;
      const currentParams = new URLSearchParams(window.location.search);
      return {
        activeRegion: currentParams.get("region") || "tracts",
        activeBubble: currentParams.get("bubble") || "efr",
        activeChoropleth: currentParams.get("choropleth") || "mhi",
        activeDateRange: [
          currentParams.get("start") || "2021-07-01",
          currentParams.get("end") || "2021-07-31",
        ],
      };
    },
    // TODO: provide better parser that validates params are correct
    parseRoute: (routeString) => new URLSearchParams(routeString).entries,
  };
}
