import React from "react";
import { Paper, Box, Typography } from "@material-ui/core";
import { animated } from "react-spring";
import { withStyles } from "@material-ui/styles";
const AnimatedPaper = animated(Paper);
const StyledCard = withStyles({
  root: {
    borderRadius: 8,
    border: `1px solid #e6e6e6`,
  },
})(AnimatedPaper);

const Card = ({ title, noPadding = false, children, ...props }) => {
  const topRow =
    typeof title === "string" ? (
      <Typography variant="overline" color="textSecondary">
        {title}
      </Typography>
    ) : (
      title
    );
  return (
    <StyledCard elevation={1} {...props}>
      <Box p={2} pb={1}>
        {topRow}
      </Box>
      <Box p={noPadding ? 0 : 2} pt={noPadding ? 0 : 1}>
        {children}
      </Box>
    </StyledCard>
  );
};

export default Card;
