import React from "react";
import { RouterContext } from "./Router";

export function useRouterContext() {
  const context = React.useContext(RouterContext);
  if (!context) {
    throw new Error(
      `Components using RouterContext cannot be rendered outside the provider`
    );
  }
  return context;
}
