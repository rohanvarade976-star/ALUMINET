import { create } from 'zustand';

const applyTheme = (theme) => {
  const root = window.document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(theme === 'dark' ? 'dark' : 'light');
};

const normalizeTheme = (stored) => (stored === 'dark' ? 'dark' : 'light');

const useThemeStore = create((set, get) => ({
  theme: normalizeTheme(localStorage.getItem('theme')),

  setTheme: (theme) => {
    const next = theme === 'dark' ? 'dark' : 'light';
    localStorage.setItem('theme', next);
    applyTheme(next);
    set({ theme: next });
  },

  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    get().setTheme(next);
  },

  initTheme: () => {
    const stored = localStorage.getItem('theme');
    const next = normalizeTheme(stored);
    if (stored === 'system') localStorage.setItem('theme', next);
    applyTheme(next);
    set({ theme: next });
  },
}));

export default useThemeStore;
