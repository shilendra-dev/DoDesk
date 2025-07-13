'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'

interface ThemeContextType {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('theme');
          if (stored === 'light' || stored === 'dark') return stored;
        }
        return 'dark';
      });

    useEffect(() => {
        if(typeof window !== 'undefined'){
            localStorage.setItem('theme', theme);

            if(theme === "dark"){
                document.documentElement.classList.add('dark')
            }else{
                document.documentElement.classList.remove('dark')
            }
        }
    },[theme]);

    const toggleTheme = ()  => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if(!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}