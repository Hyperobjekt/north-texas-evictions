// default route template
export const ROUTE_TEMPLATE =
  "#/:activeRegion/:activeBubble/:activeChoropleth/:start/:end/:zoom/:latitude/:longitude";

/**
 * Parses route values from the provided route string.
 * @param {*} template
 * @param {*} routeString
 * @returns
 */
export const parseRoute = (template = ROUTE_TEMPLATE, routeString) => {
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
  keys
    // .filter((k) => ["start", "end"].indexOf(k) === -1)
    .forEach(
      (key, i) =>
        (result[key] =
          ["latitude", "longitude", "zoom"].indexOf(key) > -1
            ? Number(values[i])
            : values[i])
    );
  result.activeDateRange = [result.start, result.end];
  const searchParams = new URLSearchParams(
    window.location.hash.split("?")?.[1]
  );
  result.precinct = searchParams.get("precinct");
  return result;
};

/** Inserts route values into the provided template */
export const populateRoute = (template = ROUTE_TEMPLATE, values) => {
  if (!values) return "";
  const regex = template.replace(/:[A-Za-z]+/g, "(:?[.A-Za-z0-9-]+)");
  // pull the keys from the route template
  const templateKeys = template
    .match(regex)
    .slice(1)
    .map((k) => k.slice(1));
  const { precinct, ...hashValues } = values;
  const valueKeys = Object.keys(hashValues);
  // only update route if all values are present
  if (templateKeys.sort().join(",") !== valueKeys.sort().join(",")) {
    console.warn("could not update route, invalid values provided");
    return "#/invalid";
  }
  // populate the template with the values
  const hashRoute = Object.entries(hashValues).reduce(
    (routeString, current) => {
      return routeString.replace(`:${current[0]}`, current[1]);
    },
    template
  );
  return precinct ? `${hashRoute}?precinct=${precinct}` : hashRoute;
};

/** Returns true if the route should update */
export const validateRoute = ({ route, values }) => {
  if (!values) return false;
  if (route.indexOf("null") > -1 || route.indexOf("undefined") > -1)
    return false;
  return true;
};

export const getCurrentRouteParams = () => {
  const params = parseRoute(ROUTE_TEMPLATE, window.location.hash);
  return params;
};
