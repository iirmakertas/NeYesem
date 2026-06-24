import { createContext, useContext, useState, useEffect } from 'react';
import { StatusBar, Style } from '@capacitor/status-bar';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('ne-yesem-theme');
        // If user has explicitly chosen a theme before, respect it.
        // Otherwise always default to dark so Android phones don't open in light mode.
        if (saved !== null) return saved === 'dark';
        return true; // default: dark on all devices
    });

    useEffect(() => {
        const root = document.documentElement;
        if (isDark) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('ne-yesem-theme', isDark ? 'dark' : 'light');

        // Dynamically update theme-color meta tag for mobile status bar coloring
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', isDark ? '#0f1117' : '#fefefe');
        }

        // Dynamically update native mobile status bar style
        const updateNativeStatusBar = async () => {
            try {
                await StatusBar.setStyle({
                    style: isDark ? Style.Dark : Style.Light
                });
                await StatusBar.setBackgroundColor({
                    color: isDark ? '#0f1117' : '#fefefe'
                });
            } catch (e) {
                // Ignore if not running in a Capacitor native container
            }
        };
        updateNativeStatusBar();
    }, [isDark]);

    const toggleTheme = () => setIsDark(prev => !prev);

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within a ThemeProvider');
    return context;
};
