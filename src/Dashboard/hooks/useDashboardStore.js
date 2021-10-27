import create from "zustand";

/**
 * This store contains app state.  For hovered + selected locations use the map store
 */
const useDashboardStore = create((set) => ({
  ready: false,
  setReady: (ready) => set({ ready }),
  activeView: "map",
  setActiveView: (activeView) => set({ activeView }),
  activeBubble: null,
  setActiveBubble: (activeBubble) => set({ activeBubble }),
  activeChoropleth: null,
  setActiveChoropleth: (activeChoropleth) => set({ activeChoropleth }),
  dateRange: [],
  setDateRange: (dateRange) => set({ dateRange }),
  activeDateRange: [],
  setActiveDateRange: (activeDateRange) => set({ activeDateRange }),
  metrics: [],
  setMetrics: (metrics) => set({ metrics }),
  activeRegion: null,
  setActiveRegion: (activeRegion) => set({ activeRegion }),
  regions: [],
  setRegions: (regions) => set({ regions }),
  activePanel: null,
  setActivePanel: (activePanel) => set({ activePanel }),
  hoverCoords: [0, 0],
  setHoverCoords: (hoverCoords) => set({ hoverCoords }),
  defaultViewport: null,
  setDefaultViewport: (defaultViewport) => set({ defaultViewport }),
}));

export default useDashboardStore;
