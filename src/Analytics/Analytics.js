import { useEffect, useRef } from "react";
import shallow from "zustand/shallow";
import { useDashboardStore } from "../Dashboard";
import { useLang } from "../Language";

const trackChange = (type, value) => {
  window.gtag &&
    window.gtag("event", "settings_update", {
      setting: type,
      status: value,
    });
};

export const Analytics = () => {
  const enabled = useRef(false);
  const [ready, activeBubble, activeChoropleth, activeDateRange, activeRegion] =
    useDashboardStore(
      (state) => [
        state.ready,
        state.activeBubble,
        state.activeChoropleth,
        state.activeDateRange,
        state.activeRegion,
      ],
      shallow
    );

  const bubbleMetric = useLang(`METRIC_${activeBubble}`);
  const choroplethMetric = useLang(`METRIC_${activeChoropleth}`);

  useEffect(() => {
    enabled.current && trackChange("bubble", bubbleMetric);
  }, [bubbleMetric]);

  useEffect(() => {
    enabled.current && trackChange("choropleth", choroplethMetric);
  }, [choroplethMetric]);

  useEffect(() => {
    enabled.current && trackChange("region", activeRegion);
  }, [activeRegion]);

  useEffect(() => {
    enabled.current && trackChange("date_range", activeDateRange.join(","));
  }, [activeDateRange]);

  useEffect(() => {
    enabled.current = ready;
  }, [ready]);

  return null;
};
