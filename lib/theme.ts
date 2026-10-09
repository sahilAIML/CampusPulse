'use client';

import { useState, useEffect, useCallback } from 'react';

export type ThemeMode = 'white' | 'black' | 'bw';

const STORAGE_KEY = 'campuspulse_theme';
const THEME_EVENT = 'campuspulse-theme-change';

export function getSavedTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'black';
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (saved === 'white' || saved === 'black' || saved === 'bw') {
      return saved;
    }
    // Default to dark/black theme if system prefers or by default
    return 'black';
  } catch {
    return 'black';
  }
}

export function applyTheme(mode: ThemeMode) {
  if (typeof window === 'undefined') return;
  const root = document.documentElement;

  if (mode === 'white') {
    root.classList.remove('dark', 'theme-bw');
    root.classList.add('theme-white');
  } else if (mode === 'black') {
    root.classList.add('dark');
    root.classList.remove('theme-bw', 'theme-white');
  } else if (mode === 'bw') {
    root.classList.add('dark', 'theme-bw');
    root.classList.remove('theme-white');
  }

  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {}

  // Dispatch custom event for cross-component synchronization
  window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: mode }));
}

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeMode>('black');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const initialTheme = getSavedTheme();
    setThemeState(initialTheme);
    applyTheme(initialTheme);

    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<ThemeMode>;
      if (customEvent.detail) {
        setThemeState(customEvent.detail);
      } else {
        setThemeState(getSavedTheme());
      }
    };

    window.addEventListener(THEME_EVENT, handleThemeChange);
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY) {
        setThemeState(getSavedTheme());
      }
    });

    return () => {
      window.removeEventListener(THEME_EVENT, handleThemeChange);
    };
  }, []);

  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    // Quickly toggles between White and Black
    const next = theme === 'white' ? 'black' : 'white';
    setTheme(next);
  }, [theme, setTheme]);

  return {
    theme,
    setTheme,
    toggleTheme,
    mounted,
  };
}
