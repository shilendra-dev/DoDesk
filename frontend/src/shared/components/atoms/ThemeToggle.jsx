import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../../providers/ThemeContext';

const ThemeToggle = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg transition-all duration-300 cursor-pointer ${className}`}
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5">
        <span 
          className={`absolute inset-0 transform transition-transform duration-500 ease-in-out ${
            theme === 'dark' ? 'rotate-0 opacity-100' : 'rotate-90 opacity-0'
          }`}
        >
          <Sun size={20} className="text-yellow-400" />
        </span>
        
        <span 
          className={`absolute inset-0 transform transition-transform duration-500 ease-in-out ${
            theme === 'dark' ? '-rotate-90 opacity-0' : 'rotate-0 opacity-100'
          }`}
        >
          <Moon size={20} className="text-black" />
        </span>
      </div>
    </button>
  );
};

export default ThemeToggle;