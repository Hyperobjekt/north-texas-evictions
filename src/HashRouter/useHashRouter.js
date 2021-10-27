import { useDebounce } from "@hyperobjekt/hooks";
import { useEffect, useMemo } from "react";

/**
 * Provides hash routing functionality
 * @param {string} template a hash routing template (e.g. #/:page))
 * @param {object} values values to populate the route template, with object keys corresponding to template parameters
 * @param {*} populate function that handles populating the template into the route
 * @param {*} validator function that valudates a populated route string
 */
export default function useHashRouter(template, values, populate, validator) {
  // current route string
  const routeString = useMemo(
    () => populate(template, values),
    [template, values, populate]
  );

  // debounce route updates to every 1s
  const debouncedRouteString = useDebounce(routeString, 1000);

  // runs the validator to check if the provided values and string are valid
  const isValid = validator({ route: routeString, values });

  // update route on state changes
  useEffect(() => {
    if (!isValid) return null; // do not set if it did not pass the validator
    window?.history?.replaceState(null, null, debouncedRouteString);
  }, [debouncedRouteString, isValid]);
}
