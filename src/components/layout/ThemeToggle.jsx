import { useTheme } from '../../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';

export default function ThemeToggle() {
    const { isDark, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="touch-target tap-highlight-none relative flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300 cursor-pointer"
            style={{
                backgroundColor: isDark ? 'var(--color-primary-50)' : 'var(--bg-chip)',
                color: isDark ? 'var(--color-accent)' : 'var(--color-primary)',
            }}
            aria-label={isDark ? 'Açık temaya geç' : 'Koyu temaya geç'}
        >
            <div className="relative w-5 h-5">
                <FiSun
                    className={`absolute inset-0 transition-all duration-300 ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'
                        }`}
                    size={20}
                />
                <FiMoon
                    className={`absolute inset-0 transition-all duration-300 ${isDark ? 'opacity-0 -rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
                        }`}
                    size={20}
                />
            </div>
        </button>
    );
}
