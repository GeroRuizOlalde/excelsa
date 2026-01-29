"use client";

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({ 
  isDark: false, 
  toggleTheme: () => {} 
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState<boolean | null>(null);

  useEffect(() => {
    // 1. Al cargar, leemos la "memoria" del navegador
    const savedTheme = localStorage.getItem('theme');
    
    // 2. Si no hay nada guardado, podemos ver la preferencia del sistema operativo
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);

    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark'); // <-- Aquí se guarda para siempre
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light'); // <-- Aquí se guarda para siempre
    }
  };

  // Evitamos renderizar hasta que sepamos el tema (previene el parpadeo)
  if (isDark === null) return <>{children}</>;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);