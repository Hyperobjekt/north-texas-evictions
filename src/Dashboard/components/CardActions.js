import { Box, withStyles } from "@material-ui/core";

const CardActions = withStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "stretch",
    alignItems: "stretch",
    margin: "0 -1px -1px -1px",
    height: 40,
    "& > *": {
      flex: 1,
      position: "relative",
      // bring the button to the front on hover / focus
      "&:hover, &:focus": {
        zIndex: 2,
      },
    },
    // offset the double border on children side-by-side
    "& > * + *": {
      marginLeft: -1,
    },
    // set proper border radius for children
    "& > *:first-child": {
      borderRadius: "0 0 0 8px",
    },
    "& > *:last-child": {
      borderRadius: "0 0 8px 0",
    },
    "& > *:last-child:first-child": {
      borderRadius: "0 0 8px 8px",
    },
  },
}))(Box);

export default CardActions;
