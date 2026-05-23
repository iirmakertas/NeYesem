import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GiRollingDices } from 'react-icons/gi';
import { MdKitchen, MdFavorite, MdMenuBook } from 'react-icons/md';

export default function Dashboard() {
    const { user, userData } = useAuth();

    const displayName = userData?.displayName || user?.email?.split('@')[0] || 'Şef';

    const modules = [
        {
            title: 'Zar At',
            description: 'Ne yiyeceğine karar veremiyor musun? Hemen bir zar at ve sana özel seçtiğimiz tarifi keşfet!',
            icon: <GiRollingDices size={40} />,
            path: '/zar-at',
            gradient: 'linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #f87171 100%)',
            emoji: '🎲',
        },
        {
            title: 'Ne Var?',
            description: 'Dolabındaki malzemeleri seç, elindekilerle yapabileceğin en lezzetli yemek tariflerini anında bul!',
            icon: <MdKitchen size={40} />,
            path: '/ne-var',
            gradient: 'linear-gradient(135deg, #f97316 0%, #fb923c 50%, #fdba74 100%)',
            emoji: '🥕',
        },
        {
            title: 'Tarif Defterim',
            description: 'Kendi tariflerini ekle, düzenle ve dilediğin zaman kişisel dijital defterine göz at!',
            icon: <MdMenuBook size={40} />,
            path: '/tarif-defterim',
            gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 50%, #c4b5fd 100%)',
            emoji: '📖',
        },
        {
            title: 'Favoriler',
            description: 'Beğendiğin ve kaydettiğin tüm tariflere buradan hızlıca ulaş, favorilerini incele!',
            icon: <MdFavorite size={40} />,
            path: '/favoriler',
            gradient: 'linear-gradient(135deg, #e11d48 0%, #f43f5e 50%, #fb7185 100%)',
            emoji: '❤️',
        },
    ];

    return (
        <div className="min-h-screen px-4 py-8 md:py-12" style={{ backgroundColor: 'var(--bg-main)' }}>
            <div className="max-w-2xl mx-auto">
                {/* Welcome Section */}
                <div className="text-center mb-10 animate-fade-in">
                    <div className="text-5xl mb-3">👋</div>
                    <h1
                        className="text-2xl md:text-3xl font-bold mb-2"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        Hoş Geldin!
                    </h1>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <span className="font-medium" style={{ color: 'var(--color-primary)' }}>
                             {displayName}
                        </span>
                        {' — '}Bugün ne pişirmek istersin?
                    </p>
                </div>

                {/* Module Cards */}
                <div className="grid gap-4 md:gap-6">
                    {modules.map((mod, index) => (
                        <Link
                            key={mod.path}
                            to={mod.path}
                            className="no-underline animate-slide-up"
                            style={{ animationDelay: `${index * 120}ms`, animationFillMode: 'both' }}
                        >
                            <div
                                className="relative rounded-2xl p-6 md:p-8 overflow-hidden transition-all duration-300 cursor-pointer group"
                                style={{
                                    background: mod.gradient,
                                    boxShadow: 'var(--shadow-lg)',
                                }}
                            >
                                {/* Background emoji */}
                                <div className="absolute right-4 bottom-2 text-7xl opacity-20 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
                                    {mod.emoji}
                                </div>

                                <div className="relative z-10 flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center text-white flex-shrink-0">
                                        {mod.icon}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white mb-1">
                                            {mod.title}
                                        </h2>
                                        <p className="text-sm text-white/80 leading-relaxed">
                                            {mod.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Arrow */}
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-white/40 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white/70">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 18l6-6-6-6" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Quick Stats */}
                <div
                    className="mt-8 p-4 rounded-2xl border text-center animate-fade-in"
                    style={{
                        backgroundColor: 'var(--bg-card)',
                        borderColor: 'var(--border-color)',
                        animationDelay: '400ms',
                        animationFillMode: 'both',
                    }}
                >
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                        🍽️ 12 kategori • Sınırsız lezzet
                    </p>
                </div>
            </div>
        </div>
    );
}
