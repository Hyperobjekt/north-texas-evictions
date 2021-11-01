import React, { useEffect } from "react";
import { animated, useSpring } from "react-spring";
import { Box, IconButton, Paper, Typography } from "@material-ui/core";
import clsx from "clsx";
import { withStyles } from "@material-ui/styles";
import { Stack } from "@hyperobjekt/material-ui-website";
import CloseIcon from "@material-ui/icons/Close";
import useMediaQueries from "../../App/hooks/useMediaQueries";

const styles = (theme) => ({
  root: {
    position: "relative",
    flex: 0,
    height: "100%",
    zIndex: 100,
    maxHeight: "100%",
    [theme.breakpoints.down("xs")]: {
      position: "fixed",
      right: 0,
      top: 0,
      width: "100%",
      zIndex: 1101,
    },
  },
  left: {},
  right: {},
  float: {
    position: "fixed",
    top: 64,
    maxHeight: "calc(100% - 64px)",
    "&$right": {
      right: 0,
    },
    "&$left": {
      left: 0,
    },
  },
  contentWrapper: {
    minWidth: 320,
    maxHeight: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "stretch",
  },
  header: {
    padding: theme.spacing(2, 3, 2, 3),
    height: 64,
    borderBottom: `1px solid ${theme.palette.divider}`,
    boxSizing: "border-box",
  },
  body: {
    padding: theme.spacing(3, 3),
    overflow: "auto",
    maxHeight: "calc(100% - 64px)",
    boxSizing: "border-box",
  },
});

const AnimatedPaper = animated(Paper);

const Panel = ({
  open = false,
  classes,
  className,
  width = 320,
  float,
  position = "left",
  title,
  children,
  onOpen,
  onClose,
  ...props
}) => {
  const { isMobile } = useMediaQueries();

  // 👇 setup transforms required (based on float and position)
  const springOptions = {};
  const transformProp = float
    ? "x"
    : position === "right"
    ? "marginRight"
    : "marginLeft";
  const transformWidth = isMobile ? window.innerWidth : width;
  const transformAmount =
    !float || position !== "right" ? -1 * transformWidth : transformWidth;
  springOptions[transformProp] = open ? 0 : transformAmount;
  springOptions.width = transformWidth;
  const style = useSpring(springOptions);

  // 👇  manage focus state
  const buttonRef = React.useRef();
  const restoreRef = React.useRef();
  useEffect(() => {
    // if opening, set the element to restore to
    if (open && document.activeElement)
      restoreRef.current = document.activeElement;
    // slight delay to allow the panel to open / close
    setTimeout(() => {
      open && buttonRef.current?.focus();
      !open && restoreRef.current?.focus();
    }, 400);
  }, [open]);

  return (
    <AnimatedPaper
      square
      elevation={2}
      className={clsx(
        "HypPanel-root",
        classes.root,
        {
          [classes.float]: float,
          [classes.right]: position === "right",
          [classes.left]: position === "left",
        },
        className
      )}
      style={{
        ...style,
        // hide visibility when animation is complete and panel is closed
        visibility: style[transformProp].to((val) =>
          Math.abs(val) === transformWidth ? "hidden" : "visible"
        ),
      }}
      {...props}
    >
      <Box className={clsx("HypPanel-contentWrapper", classes.contentWrapper)}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          className={clsx("HypPanel-header", classes.header)}
        >
          <Typography variant="h2">{title}</Typography>
          <IconButton ref={buttonRef} size="small" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box className={clsx("HypPanel-body", classes.body)}>
          <Stack
            direction="vertical"
            between="lg"
            alignItems="stretch"
            flexWrap="nowrap"
          >
            {children}
          </Stack>
        </Box>
      </Box>
    </AnimatedPaper>
  );
};

export default withStyles(styles, { name: "HypPanel" })(Panel);
