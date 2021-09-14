import { useCallback } from "react";
import shallow from "zustand/shallow";
import useDashboardStore from "../Dashboard/hooks/useDashboardStore";

/**
 * Returns a callback function that toggles the open status of the data options panel
 * @returns
 */
export default function useTogglePanel(panelId = "DATA_OPTIONS") {
  const [activePanel, setActivePanel] = useDashboardStore(
    (state) => [state.activePanel, state.setActivePanel],
    shallow
  );
  return useCallback(() => {
    activePanel ? setActivePanel(null) : setActivePanel(panelId);
  }, [activePanel, setActivePanel, panelId]);
}
