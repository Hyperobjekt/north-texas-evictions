import React from "react";
import PropTypes from "prop-types";
import { Button } from "@material-ui/core";
import { useLang } from "../Language";
import useDashboardStore from "../Dashboard/hooks/useDashboardStore";
import shallow from "zustand/shallow";

const PanelToggle = (props) => {
  const [activePanel, setActivePanel] = useDashboardStore(
    (state) => [state.activePanel, state.setActivePanel],
    shallow
  );
  const label = useLang("BUTTON_CHANGE_OPTIONS");
  const handleToggle = () => {
    activePanel ? setActivePanel(null) : setActivePanel("DATA_OPTIONS");
  };
  return (
    <Button variant="contained" fullWidth onClick={handleToggle} {...props}>
      {label}
    </Button>
  );
};

PanelToggle.propTypes = {};

export default PanelToggle;
