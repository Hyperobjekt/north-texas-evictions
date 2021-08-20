import create from "zustand";

const useLanguageStore = create((set) => ({
  language: "en",
  setLanguage: (language, dict) => set({ language, dict }),
  dict: { en: {} },
  setLanguageDict: (dict) => set({ dict }),
}));

export default useLanguageStore;
