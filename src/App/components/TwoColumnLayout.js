import React from "react";
import { Box } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";

const LayoutWrapperBox = withStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column-reverse",
    paddingTop: 48,
    [theme.breakpoints.up("md")]: {
      display: "grid",
      gridTemplateColumns: "324px auto",
      gridTemplateRows: "auto",
      minHeight: "100%",
      paddingTop: 0,
    },
  },
}))(Box);

const LeftBox = withStyles((theme) => ({
  root: {
    gridRow: "1",
    gridColumn: "1",
    padding: theme.spacing(3, 1, 3, 3),
    [theme.breakpoints.down("sm")]: {
      backgroundImage: `linear-gradient(transparent, ${theme.palette.background.default} 80px)`,
      padding: theme.spacing(2),
      marginTop: `calc(100vh - 172px)`,
      position: "relative",
      zIndex: 10,
      minHeight: `calc(100vh - 16px)`,
    },
  },
}))(Box);

const RightBox = withStyles((theme) => ({
  root: {
    [theme.breakpoints.up("md")]: {
      position: "relative",
      gridColumn: "2",
      gridRow: "1",
      padding: theme.spacing(3, 3, 3, 1),
    },
  },
}))(Box);

const TwoColumnLayout = ({
  left,
  right,
  LeftBoxProps = {},
  RightBoxProps = {},
  ...props
}) => {
  return (
    <LayoutWrapperBox {...props}>
      <LeftBox {...LeftBoxProps}>{left}</LeftBox>
      <RightBox {...RightBoxProps}>{right}</RightBox>
    </LayoutWrapperBox>
  );
};

export default TwoColumnLayout;
