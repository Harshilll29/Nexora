import { create } from 'zustand'

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("nexora-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("nexora-theme", theme);
    set({theme});
  },
}));
