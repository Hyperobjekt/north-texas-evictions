import create from "zustand";

/**
 * This store contains app state.  For hovered + selected locations use the map store
 */
const useLocationStore = create((set) => ({
  // determines if the slide out locations panel is active
  showLocations: false,
  setShowLocations: (showLocations) => set({ showLocations }),
  // determines if the slide out locations panel is expanded
  expandLocations: false,
  setExpandLocations: (expandLocations) => set({ expandLocations }),
  // active location (displayed in the location details panel)
  active: null,
  setActive: (location) => set({ active: location }),
  // list of all locations (geojson features)
  locations: [],
  addLocation: (location) => {
    set((state) => ({
      locations:
        state.locations.findIndex((l) => l.id === location.id) === -1
          ? [...state.locations, location]
          : state.locations,
    }));
  },
  addLocations: (locations) => {
    set((state) => ({
      locations: [...state.locations, ...locations],
    }));
  },
  removeLocation: (location) => {
    set((state) => ({
      locations: state.locations.filter((l) => l.id !== location.id),
    }));
  },
  // locations with visible status turned on
  pinned: [],
  addPinned: (location) => {
    set((state) => ({
      pinned:
        state.pinned.findIndex((l) => l.id === location.id) === -1
          ? [...state.pinned, location]
          : state.pinned,
    }));
  },
  addPinnedLocations: (locations) => {
    set((state) => ({
      pinned: [...state.pinned, ...locations],
    }));
  },
  removePinned: (location) => {
    set((state) => ({
      pinned: state.pinned.filter((l) => l.id !== location.id),
    }));
  },
  // a queue of locations IDs to load and add to the map
  loadQueue: [],
  addToLoadQueue: (locations) => {
    locations = locations.map((location) =>
      typeof location === "string"
        ? { id: location, pinned: true, activate: false }
        : location
    );
    set((state) => ({
      loadQueue: [...state.loadQueue, ...locations],
    }));
  },
  removeFromLoadQueue: (locationIds) => {
    set((state) => ({
      loadQueue: state.loadQueue.filter(
        (l) => locationIds.indexOf(l.id) === -1
      ),
    }));
  },
  // scroll position of the locations panel, used for syncing
  scrollPosition: 0,
  setScrollPosition: (scrollPosition) => set({ scrollPosition }),
  // determines if time comparison show counts or relative to 2019
  comparisonType: "counts",
  setComparisonType: (comparisonType) => set({ comparisonType }),
}));

export default useLocationStore;
