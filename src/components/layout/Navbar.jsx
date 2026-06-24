import { useNavigate } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiHome, FiLogOut } from 'react-icons/fi';
import { GiRollingDices } from 'react-icons/gi';
import { MdFavorite, MdKitchen, MdMenuBook } from 'react-icons/md';

export default function Navbar() {
    const { user, userData, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

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
        { path: '/tarif-defterim', label: 'Defterim', icon: <MdMenuBook size={20} /> },
        { path: '/favoriler', label: 'Favoriler', icon: <MdFavorite size={20} /> },
    ];

    const isActive = (path) => location.pathname === path;

    if (!user || !user.emailVerified) return null;

    const displayName = userData?.displayName || user?.email?.split('@')[0] || 'Şef';

    return (
        <>
            {/* Desktop Navbar */}
            <nav
                className="glass-strong fixed top-0 left-0 right-0 z-50 hidden md:block border-b"
                style={{
                    backgroundColor: 'var(--bg-nav)',
                    borderColor: 'var(--border-color)',
                    paddingTop: 'env(safe-area-inset-top)',
                }}
            >
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/dashboard" className="flex items-center gap-2 no-underline">
                        <img
                            src="/favicon-32x32.png"
                            alt="Logo"
                            className="w-8 h-8 rounded-lg object-contain"
                        />
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
                        {/* Profile Link */}
                        <Link
                            to="/profile"
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg no-underline transition-all duration-200 hover:opacity-80"
                            style={{
                                backgroundColor: 'var(--bg-chip)',
                                color: 'var(--text-chip)',
                            }}
                        >
                            <span className="text-base">
                                {userData?.photoURL || '👤'}
                            </span>
                            <span className="text-xs font-medium hidden sm:inline">
                                {displayName}
                            </span>
                        </Link>
                        
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

            {/* Mobile Bottom Tab Bar — sticky, never covered by keyboard */}
            <nav
                className="glass-strong fixed bottom-0 left-0 right-0 z-50 md:hidden border-t"
                style={{
                    backgroundColor: 'var(--bg-nav)',
                    borderColor: 'var(--border-color)',
                    /* Safe area for home bar on iPhone */
                    paddingBottom: 'env(safe-area-inset-bottom)',
                }}
            >
                <div className="flex items-center justify-around px-1 pt-1 pb-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="tap-highlight-none flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-xl no-underline transition-all duration-200"
                            style={{
                                color: isActive(item.path) ? 'var(--color-primary)' : 'var(--text-tertiary)',
                                flex: 1,
                                minWidth: 0,
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
                            <span className="text-[9px] font-medium leading-tight text-center w-full truncate">{item.label}</span>
                        </Link>
                    ))}
                    <Link
                        to="/profile"
                        className="tap-highlight-none flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-xl no-underline transition-all duration-200"
                        style={{
                            color: isActive('/profile') ? 'var(--color-primary)' : 'var(--text-tertiary)',
                            flex: 1,
                            minWidth: 0,
                        }}
                    >
                        <div
                            className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200"
                            style={{
                                backgroundColor: isActive('/profile') ? 'var(--color-primary-50)' : 'transparent',
                                transform: isActive('/profile') ? 'scale(1.1)' : 'scale(1)',
                            }}
                        >
                            <span className="text-base">{userData?.photoURL || '👤'}</span>
                        </div>
                        <span className="text-[9px] font-medium leading-tight">Profil</span>
                    </Link>
                </div>
            </nav>

            {/* Top spacer for desktop (accounts for safe area too) */}
            <div className="hidden md:block" style={{ height: 'calc(4rem + env(safe-area-inset-top))' }} />
            {/* Bottom spacer for mobile */}
            <div className="md:hidden" style={{ height: 'calc(3.5rem + env(safe-area-inset-bottom))' }} />
        </>
    );
}
