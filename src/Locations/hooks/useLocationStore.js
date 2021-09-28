import create from "zustand";

/**
 * This store contains app state.  For hovered + selected locations use the map store
 */
const useLocationStore = create((set) => ({
  active: null,
  setActive: (location) => set({ active: location }),
  locations: [],
  addLocation: (location) => {
    set((state) => ({
      locations:
        state.locations.findIndex((l) => l.id === location.id) === -1
          ? [...state.locations, location]
          : state.locations,
    }));
  },
  removeLocation: (location) => {
    set((state) => ({
      locations: state.locations.filter((l) => l.id !== location.id),
    }));
  },
  pinned: [],
  addPinned: (location) => {
    set((state) => ({
      pinned: [...state.pinned, location],
    }));
  },
  removePinned: (location) => {
    set((state) => ({
      pinned: state.pinned.filter((l) => l.id !== location.id),
    }));
  },
}));

export default useLocationStore;
