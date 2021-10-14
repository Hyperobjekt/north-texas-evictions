import create from "zustand";

/**
 * This store contains time series related state.
 */
const useTimeSeriesStore = create((set) => ({
  /** Determines if the "all data" line is shown on the time series */
  showOverall: true,
  setShowOverall: (showOverall) => set({ showOverall }),
}));

export default useTimeSeriesStore;
