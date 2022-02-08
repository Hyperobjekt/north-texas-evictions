import React from "react";
import { Button } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import DownloadIcon from "@material-ui/icons/GetApp";

const StyledButton = withStyles({
  root: {
    borderRadius: 6,
    paddingRight: 12,
    paddingLeft: 16,
  },
  label: {
    alignItems: "center",
    justifyContent: "space-between",
  },
})(Button);

const DownloadButton = (props) => {
  return (
    <StyledButton
      component="a"
      fullWidth
      variant="contained"
      color="secondary"
      href="https://github.com/childpovertyactionlab/cpal-evictions/blob/production/filing%20data/NTEP_datadownload.csv?raw=true"
      download
      target="_blank"
      referrerPolicy="no-referrer"
      {...props}
    >
      <span>Download Raw Data</span>
      <DownloadIcon />
    </StyledButton>
  );
};

export default DownloadButton;
