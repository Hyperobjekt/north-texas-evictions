import React, { useRef, useState } from "react";
import clsx from "clsx";
import { Button, Drawer, IconButton, withStyles } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

const styles = (theme) => ({
  root: {
    display: "block",
  },
  button: {
    color: theme.palette.header.text,
    height: 42,
  },
  drawer: {
    "& .MuiDrawer-paper": {
      minWidth: 320,
    },
  },
  close: {
    marginLeft: "auto",
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(2),
  },
});

/**
 * Provides mobile-friendly navigation, with a menu button that triggers a drawer to open.
 */
const Menu = ({
  classes,
  className,
  buttonLabel,
  anchor = "right",
  children,
  ...props
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeRef = useRef(null);
  const openRef = useRef(null);

  const handleToggleMenu = () => {
    const isOpen = !menuOpen;
    setMenuOpen(isOpen);
    if (isOpen) {
      // closeRef?.current?.focus()
    } else {
      openRef.current.focus();
    }
  };

  return (
    <div className={clsx(classes.root, className)} {...props}>
      <Button
        ref={openRef}
        className={clsx(classes.button, "dark")}
        variant="contained"
        onClick={handleToggleMenu}
      >
        {buttonLabel}
      </Button>
      <Drawer
        className={classes.drawer}
        anchor={anchor}
        open={menuOpen}
        onClose={handleToggleMenu}
      >
        <IconButton
          className={classes.close}
          ref={closeRef}
          onClick={handleToggleMenu}
        >
          <CloseIcon aria-label="close menu" />
        </IconButton>
        {children}
      </Drawer>
    </div>
  );
};

export default withStyles(styles)(Menu);
