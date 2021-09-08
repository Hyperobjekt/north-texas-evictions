import React from "react";
import {
  Box,
  FormControlLabel,
  FormLabel,
  InputLabel,
  Typography,
} from "@material-ui/core";
import clsx from "clsx";
import { useLang } from "../../Language";
import { withStyles } from "@material-ui/styles";
import DateSelect from "./DateSelect";

const styles = (theme) => ({
  root: {
    flex: 1,
  },
  row: {
    margin: theme.spacing(1, 0, 0),
  },
  label: {
    display: "block",
    transform: "translate(0, 1.5px) scale(0.75)",
    transformOrigin: "top left",
  },
  to: {
    margin: theme.spacing(0, 1, 0),
  },
});

const DateRangeSelect = ({ classes }) => {
  const title = useLang("SELECT_DATE_RANGE");
  return (
    <Box className={clsx(classes.root)}>
      <FormLabel className={clsx(classes.label)}>{title}</FormLabel>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        className={clsx(classes.row)}
      >
        <DateSelect type="start" />
        <Typography className={clsx(classes.to)}>to</Typography>
        <DateSelect type="end" />
      </Box>
    </Box>
  );
};

export default withStyles(styles)(DateRangeSelect);
