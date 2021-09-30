import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  withStyles,
  Button,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

export const styles = (theme) => ({
  button: {},
  dialog: {
    maxWidth: theme.typography.pxToRem(555),
  },
  title: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: theme.spacing(9),
    padding: theme.spacing(0, 2, 0, 4),
    borderBottom: "1px solid",
    borderBottomColor: theme.palette.divider,
  },
  closeButton: {
    color: theme.palette.text.secondary,
    fontSize: theme.typography.pxToRem(18),
  },
  content: {
    padding: theme.spacing(3, 4, 3, 4),
  },
});

const Modal = ({
  classes,
  className,
  title = "Modal",
  content,
  children,
  DialogProps = {},
  ...props
}) => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const openHandler = () => setModalOpen(true);
  const closeHandler = () => setModalOpen(false);

  return (
    <>
      {children && (
        <Button
          onClick={openHandler}
          className={clsx(classes.button, className)}
          variant="contained"
          {...props}
        >
          {children}
        </Button>
      )}
      <Dialog
        aria-labelledby="modal-title"
        classes={{ paper: classes.dialog }}
        open={modalOpen}
        onClose={closeHandler}
        {...DialogProps}
      >
        <DialogTitle disableTypography classes={{ root: classes.title }}>
          <Typography id="modal-title" variant="h1">
            {title}
          </Typography>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={DialogProps.onClose || closeHandler}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent classes={{ root: classes.content }}>
          {content}
        </DialogContent>
      </Dialog>
    </>
  );
};

Modal.propTypes = {
  content: PropTypes.any,
  title: PropTypes.string,
  className: PropTypes.string,
};

export default withStyles(styles)(Modal);
