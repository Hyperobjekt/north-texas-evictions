import useDashboardContext from "./useDashboardContext";
import useDebouncedViewport from "./useDebouncedViewport";

// default route template
export const ROUTE_TEMPLATE =
  "#/:activeRegion/:activeBubble/:activeChoropleth/:start/:end/:zoom/:latitude/:longitude";

export const parseRouteValues = (template = ROUTE_TEMPLATE, routeString) => {
  if (!routeString) return {};
  const regex = template.replace(/:[A-Za-z]+/g, "(:?[.A-Za-z0-9-]+)");
  // pull the keys from the route template
  const keys = template
    .match(regex)
    .slice(1)
    .map((k) => k.slice(1));
  // pull the values from the route string
  const matches = routeString.match(regex);
  if (!matches) return {};
  const values = matches.slice(1);
  // invalid route if length of keys do not match values
  if (keys.length !== values.length) return {};
  // map keys and values to object
  var result = {};
  keys.forEach(
    (key, i) =>
      (result[key] =
        ["latitude", "longitude", "zoom"].indexOf(key) > -1
          ? Number(values[i])
          : values[i])
  );
  return result;
};

export const populateRouteValues = (template = ROUTE_TEMPLATE, values) => {
  const regex = template.replace(/:[A-Za-z]+/g, "(:?[.A-Za-z0-9-]+)");
  // pull the keys from the route template
  const templateKeys = template
    .match(regex)
    .slice(1)
    .map((k) => k.slice(1));
  const valueKeys = Object.keys(values);
  // only update route if all values are present
  if (templateKeys.sort().join(",") !== valueKeys.sort().join(",")) {
    console.warn("could not update route, invalid values provided");
    return;
  }
  // populate the template with the values
  return Object.entries(values).reduce((routeString, current) => {
    return routeString.replace(`:${current[0]}`, current[1]);
  }, template);
};

/**
 * Returns an object that contains the dashboard route query params string,
 * and a parser function.
 * @returns { route: string, parseRoute: function }
 */
export default function useDashboardRoute(routeTemplate = ROUTE_TEMPLATE) {
  // pull current dashboard values from the store
  const context = useDashboardContext();
  // pull current viewport values for the map
  const { latitude, longitude, zoom } = useDebouncedViewport();
  const routeValues = {
    activeRegion: context?.activeRegion,
    activeBubble: context?.activeBubble,
    activeChoropleth: context?.activeChoropleth,
    start: context?.activeDateRange[0],
    end: context?.activeDateRange[1],
    zoom,
    latitude,
    longitude,
  };
  const routeString = populateRouteValues(routeTemplate, routeValues);
  return {
    route: routeString,
    getCurrentParams: () => {
      const params = parseRouteValues(routeTemplate, window.location.hash);
      return params;
    },
    // TODO: provide better parser that validates params are correct
    parseRoute: (routeString) => parseRouteValues(routeTemplate, routeString),
  };
}
