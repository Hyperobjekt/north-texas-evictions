import React from "react";

import { QueryClient, QueryClientProvider } from "react-query";

// Create a client
const queryClient = new QueryClient();

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
