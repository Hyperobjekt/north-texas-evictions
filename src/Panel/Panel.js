import React from "react";
import { animated, useSpring } from "react-spring";
import { Box, IconButton, Paper, Typography } from "@material-ui/core";
import clsx from "clsx";
import { useLang } from "../Language";
import { withStyles } from "@material-ui/styles";
import { Stack } from "@hyperobjekt/material-ui-website";
import BubbleSelect from "../Dashboard/components/BubbleSelect";
import RegionSelect from "../Dashboard/components/RegionSelect";
import ChoroplethSelect from "../Dashboard/components/ChoroplethSelect";
import useDashboardStore from "../Dashboard/hooks/useDashboardStore";
import shallow from "zustand/shallow";
import CloseIcon from "@material-ui/icons/Close";
import CourtSelect from "../Dashboard/components/CourtSelect";
import DateRangeSelect from "../Dashboard/components/DateRangeSelect";
const styles = (theme) => ({
  root: {
    position: "relative",
    flex: 1,
    height: "100%",
    zIndex: 100,
    overflow: "visible",
  },
  contentWrapper: {
    minWidth: 320,
  },
  header: {
    padding: theme.spacing(1, 1, 1, 3),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  body: { padding: theme.spacing(3, 3) },
});

const AnimatedPaper = animated(Paper);

const Panel = ({ classes, position = "right" }) => {
  const [activePanel, setActivePanel] = useDashboardStore(
    (state) => [state.activePanel, state.setActivePanel],
    shallow
  );
  const open = activePanel === "DATA_OPTIONS";
  const style = useSpring({
    maxWidth: open ? 320 : 0,
  });

  const title = useLang("TITLE_DATA_OPTIONS");
  return (
    <AnimatedPaper
      square
      elevation={2}
      className={clsx(classes.root)}
      style={style}
    >
      <Box className={clsx(classes.contentWrapper)}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          className={clsx(classes.header)}
        >
          <Typography>{title}</Typography>
          <IconButton onClick={() => setActivePanel(null)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box className={clsx(classes.body)}>
          <Stack direction="vertical" between="lg" alignItems="stretch">
            <RegionSelect />
            <BubbleSelect />
            <ChoroplethSelect />
            <DateRangeSelect />
            <CourtSelect />
          </Stack>
        </Box>
      </Box>
    </AnimatedPaper>
  );
};

export default withStyles(styles)(Panel);
