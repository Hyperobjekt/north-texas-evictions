import shallow from "zustand/shallow";
import useMetricOptions from "./useMetricOptions";
import useDashboardStore from "./useDashboardStore";

export default function useDashboardBubble() {
  const [activeBubble, setActiveBubble] = useDashboardStore(
    (state) => [state.activeBubble, state.setActiveBubble],
    shallow
  );
  const bubbleMetrics = useMetricOptions().filter((m) => m.type === "bubble");
  return [activeBubble, setActiveBubble, bubbleMetrics];
}
