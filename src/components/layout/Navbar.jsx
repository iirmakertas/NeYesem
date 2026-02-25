import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { FiHome, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { GiRollingDices } from 'react-icons/gi';
import { MdFavorite, MdKitchen } from 'react-icons/md';

export default function Navbar() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const navItems = [
        { path: '/dashboard', label: 'Ana Menü', icon: <FiHome size={20} /> },
        { path: '/zar-at', label: 'Zar At', icon: <GiRollingDices size={20} /> },
        { path: '/ne-var', label: 'Ne Var?', icon: <MdKitchen size={20} /> },
        { path: '/favoriler', label: 'Favoriler', icon: <MdFavorite size={20} /> },
    ];

    const isActive = (path) => location.pathname === path;

    if (!user) return null;

    return (
        <>
            {/* Desktop Navbar */}
            <nav
                className="glass-strong fixed top-0 left-0 right-0 z-50 hidden md:block border-b"
                style={{
                    backgroundColor: 'var(--bg-nav)',
                    borderColor: 'var(--border-color)',
                }}
            >
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/dashboard" className="flex items-center gap-2 no-underline">
                        <span className="text-2xl">🍽️</span>
                        <span
                            className="text-xl font-bold"
                            style={{ color: 'var(--color-primary)' }}
                        >
                            Ne Yesem?
                        </span>
                    </Link>

                    <div className="flex items-center gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium no-underline transition-all duration-200"
                                style={{
                                    backgroundColor: isActive(item.path) ? 'var(--color-primary)' : 'transparent',
                                    color: isActive(item.path) ? 'var(--text-on-primary)' : 'var(--text-secondary)',
                                }}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <button
                            onClick={handleLogout}
                            className="touch-target tap-highlight-none flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer border-0"
                            style={{
                                backgroundColor: 'var(--bg-chip)',
                                color: 'var(--text-secondary)',
                            }}
                        >
                            <FiLogOut size={16} />
                            Çıkış
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Bottom Tab Bar */}
            <nav
                className="glass-strong fixed bottom-0 left-0 right-0 z-50 md:hidden border-t"
                style={{
                    backgroundColor: 'var(--bg-nav)',
                    borderColor: 'var(--border-color)',
                }}
            >
                <div className="flex items-center justify-around px-2 py-1 pb-[max(0.25rem,env(safe-area-inset-bottom))]">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="touch-target tap-highlight-none flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-xl no-underline transition-all duration-200"
                            style={{
                                color: isActive(item.path) ? 'var(--color-primary)' : 'var(--text-tertiary)',
                            }}
                        >
                            <div
                                className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200"
                                style={{
                                    backgroundColor: isActive(item.path) ? 'var(--color-primary-50)' : 'transparent',
                                    transform: isActive(item.path) ? 'scale(1.1)' : 'scale(1)',
                                }}
                            >
                                {item.icon}
                            </div>
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    ))}
                    <div className="flex flex-col items-center gap-0.5">
                        <ThemeToggle />
                    </div>
                </div>
            </nav>

            {/* Top spacer for desktop */}
            <div className="hidden md:block h-16" />
            {/* Bottom spacer for mobile */}
            <div className="md:hidden h-20" />
        </>
    );
}
