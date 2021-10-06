import React from "react";
import { Box } from "@material-ui/core";

const TwoColumnLayout = ({
  left,
  right,
  LeftBoxProps = {},
  RightBoxProps = {},
  ...props
}) => {
  return (
    <Box
      display="grid"
      gridTemplateColumns="324px auto"
      gridTemplateRows="auto"
      minHeight="100%"
      {...props}
    >
      <Box gridRow="1" gridColumn="1" p={3} pr={1} {...LeftBoxProps}>
        {left}
      </Box>
      <Box
        position="relative"
        gridColumn="2"
        gridRow="1"
        p={3}
        pl={1}
        {...RightBoxProps}
      >
        {right}
      </Box>
    </Box>
  );
};

export default TwoColumnLayout;
