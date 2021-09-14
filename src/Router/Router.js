import React from "react";
import useRouter from "./useRouter";

export const RouterContext = React.createContext();

const RouteProvider = ({
  values,
  template,
  parse,
  populate,
  validator,
  children,
}) => {
  useRouter(template, values, populate, validator);

  return (
    <RouterContext.Provider
      value={{
        values,
        template,
        parse,
        populate,
        validator,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
};

export default RouteProvider;
