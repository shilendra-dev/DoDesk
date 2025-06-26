import { useTheme } from "../../providers/ThemeContext";

export const useThemeClasses = () => {
    const { theme } = useTheme();

    return {
        header: theme === 'dark'
            ? 'bg-[#f0f0f0] dark:bg-primary h-18 border-b border-b-gray-800'
            : 'bg-white dark:bg-gray-900 h-18 border-b border-b-gray-300',
        searchBar: theme === 'dark'
            ? 'bg-gray-800 text-white dark:bg-gray-700 dark:text-gray-300'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
        button: theme === 'dark'
            ? 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 hover:dark:bg-blue-600'
            : 'bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-400 hover:dark:bg-blue-500',
        toggle: theme === 'dark'
            ? 'bg-gray-700 text-white hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-700'
            : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-300 dark:hover:bg-gray-400',
        text: theme === 'dark'
            ? 'text-gray-300 dark:text-gray-200'
            : 'text-gray-800 dark:text-gray-400',
        input: theme === 'dark'
            ? 'bg-gray-800 text-white dark:bg-gray-700 dark:text-gray-300'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
        card: theme === 'dark'  
    }
}