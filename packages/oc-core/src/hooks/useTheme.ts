import { useEffect } from 'react';

export const useTheme = (theme: 'light' | 'dark' | 'auto') => {
  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove('dark', 'light');

    if (theme === 'dark' || theme === 'light') {
      root.classList.add(theme);
    }
  }, [theme]);
}; 