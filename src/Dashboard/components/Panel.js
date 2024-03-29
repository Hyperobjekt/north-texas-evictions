import React, { useEffect } from "react";
import { animated, useSpring } from "react-spring";
import { Box, IconButton, Paper, Typography } from "@material-ui/core";
import clsx from "clsx";
import { withStyles } from "@material-ui/styles";
import { Stack } from "@hyperobjekt/material-ui-website";
import CloseIcon from "@material-ui/icons/Close";
import useMediaQueries from "../../App/hooks/useMediaQueries";
import { HEADER_HEIGHT } from "../../theme";

const styles = (theme) => ({
  root: {
    position: "relative",
    flex: 0,
    height: "100%",
    zIndex: 100,
    maxHeight: "100%",
  },
  left: {},
  right: {},
  float: {
    position: "fixed",
    top: HEADER_HEIGHT,
    maxHeight: "calc(100% - 64px)",
    "&$right": {
      right: 0,
    },
    "&$left": {
      left: 0,
    },
  },
  absolute: {
    position: "absolute",
    top: 0,
    bottom: 0,
    height: "100%",
    "&$right": {},
    "&$left": {},
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
    height: HEADER_HEIGHT,
    borderBottom: `1px solid ${theme.palette.divider}`,
    boxSizing: "border-box",
  },
  title: {
    // so icons don't obscure name
    paddingRight: theme.spacing(5),
  },
  body: {
    padding: theme.spacing(3, 3),
    overflow: "auto",
    maxHeight: `calc(100% - ${HEADER_HEIGHT}px)`,
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
  absolute,
  position = "left",
  offset = 0,
  title,
  style: styleOverrides,
  bodyRef,
  children,
  onOpen,
  onClose,
  onScroll,
  ...props
}) => {
  const { isMobile } = useMediaQueries();

  // 👇 setup transforms required (based on float and position)
  const springOptions = {};
  const transformProp =
    float || absolute
      ? "x"
      : position === "right"
      ? "marginRight"
      : "marginLeft";
  const transformWidth = isMobile ? window.innerWidth : width;
  const transformAmount =
    !float || !absolute || position !== "right"
      ? -1 * transformWidth
      : transformWidth;
  springOptions[transformProp] = open ? 0 + offset : transformAmount - offset;
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
          [classes.absolute]: absolute,
          [classes.right]: position === "right",
          [classes.left]: position === "left",
        },
        className
      )}
      style={{
        ...style,
        // hide visibility when animation is complete and panel is closed
        // visibility: style[transformProp].to((val) =>
        //   Math.abs(val) === transformWidth ? "hidden" : "visible"
        // ),
        ...styleOverrides,
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
          <Typography variant="h2" className={classes.title}>
            {title}
          </Typography>
          {onClose && (
            <IconButton ref={buttonRef} size="small" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          )}
        </Box>
        <Box
          ref={bodyRef}
          onScroll={onScroll}
          className={clsx("HypPanel-body", classes.body)}
        >
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
