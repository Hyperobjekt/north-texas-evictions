import React from "react";
import { Button, Tooltip, withStyles } from "@material-ui/core";
import ZoomOutMap from "@material-ui/icons/ZoomOutMap";
import useFlyToFitBounds from "../hooks/useFlyToFitBounds";
import { useLang } from "../../Language";
import useDashboardRegion from "../../Dashboard/hooks/useDashboardRegion";

const styles = (theme) => ({
  root: {
    padding: 0,
    minWidth: 29,
    minHeight: 29,
  },
});

const FitBoundsControl = ({ children, ...props }) => {
  const flyToFitBounds = useFlyToFitBounds();
  const [activeRegion] = useDashboardRegion();
  const regionLabel = useLang(`REGION_${activeRegion}`);
  const fitBoundsLabel = useLang("LABEL_FIT_BOUNDS", { region: regionLabel });
  return (
    <Tooltip title={fitBoundsLabel} placement="left" arrow>
      <Button {...props} onClick={flyToFitBounds}>
        {children}
      </Button>
    </Tooltip>
  );
};

FitBoundsControl.defaultProps = {
  children: <ZoomOutMap />,
};

export default withStyles(styles)(FitBoundsControl);
