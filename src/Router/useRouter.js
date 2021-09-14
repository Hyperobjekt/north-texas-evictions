import { useEffect, useMemo } from "react";

export default function useRouter(template, values, populate, validator) {
  // current route string
  const routeString = useMemo(
    () => populate(template, values),
    [template, values, populate]
  );

  // runs the validator to check if the provided values and string are valid
  const isValid = validator({ route: routeString, values });

  // update route on state changes
  useEffect(() => {
    if (!isValid) return null; // do not set if it did not pass the validator
    window?.history?.replaceState(null, null, routeString);
  }, [routeString, isValid]);
}
