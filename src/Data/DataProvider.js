import React from "react";

import { QueryClient, QueryClientProvider } from "react-query";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // data does not change often enough to need this.
      // also, it causes a noticable performance hit when returning to the tab
      refetchOnWindowFocus: false,
    },
  },
});

const DataProvider = ({ children, ...props }) => {
  return (
    <QueryClientProvider client={queryClient} {...props}>
      {children}
    </QueryClientProvider>
  );
};

DataProvider.defaultProps = {};

DataProvider.propTypes = {};

export default DataProvider;
