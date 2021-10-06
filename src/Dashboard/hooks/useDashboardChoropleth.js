import shallow from "zustand/shallow";
import useMetricOptions from "./useMetricOptions";
import useDashboardStore from "./useDashboardStore";

export default function useDashboardChoropleth() {
  const [activeChoropleth, setActiveChoropleth] = useDashboardStore(
    (state) => [state.activeChoropleth, state.setActiveChoropleth],
    shallow
  );
  const choroplethMetrics = useMetricOptions().filter(
    (m) => m.type === "choropleth"
  );
  return [activeChoropleth, setActiveChoropleth, choroplethMetrics];
}
