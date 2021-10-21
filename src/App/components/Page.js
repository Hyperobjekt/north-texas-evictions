import { Box } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";

const Page = withStyles({
  root: {
    position: "relative",
    display: "flex",
    flex: 1,
    alignItems: "stretch",
    justifyContent: "stretch",
    flexDirection: "column",
    width: "100%",
    height: "100%",
  },
})(Box);

export default Page;
