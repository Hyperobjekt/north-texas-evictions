import React from "react";
import { Box, CircularProgress } from "@material-ui/core";

const Loading = (props) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      width="100%"
      height="100%"
      {...props}
    >
      <CircularProgress />
    </Box>
  );
};

Loading.propTypes = {};

export default Loading;
