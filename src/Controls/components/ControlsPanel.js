import React from "react";
import shallow from "zustand/shallow";
import useDashboardStore from "../../Dashboard/hooks/useDashboardStore";
import Panel from "../../Dashboard/components/Panel";
import { useLang } from "../../Language";
import {
  BubbleSelect,
  RegionSelect,
  ChoroplethSelect,
  DateRangeSelect,
} from "../";

const ControlsPanel = (props) => {
  const dataOptionsTitle = useLang("TITLE_DATA_OPTIONS");

  const [activePanel, setActivePanel] = useDashboardStore(
    (state) => [state.activePanel, state.setActivePanel],
    shallow
  );
  return (
    <Panel
      open={activePanel === "DATA_OPTIONS"}
      title={dataOptionsTitle}
      onClose={() => {
        setActivePanel(null);
      }}
      {...props}
    >
      <RegionSelect />
      <BubbleSelect />
      <ChoroplethSelect />
      <DateRangeSelect />
    </Panel>
  );
};

ControlsPanel.propTypes = {};

export default ControlsPanel;
