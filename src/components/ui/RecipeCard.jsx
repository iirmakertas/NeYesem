import { useState } from 'react';
import { FiHeart, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useFavorites } from '../../hooks/useFavorites';

export default function RecipeCard({ meal, index = 0 }) {
    const [expanded, setExpanded] = useState(false);
    const { toggleFavorite, isFavorite } = useFavorites();
    const [animateHeart, setAnimateHeart] = useState(false);
    const favorited = isFavorite(meal.id);

    const handleFavorite = async (e) => {
        e.stopPropagation();
        setAnimateHeart(true);
        await toggleFavorite(meal);
        setTimeout(() => setAnimateHeart(false), 400);
    };

    const categoryEmojis = {
        'Kahvaltı': '🌅', 'Öğle Yemeği': '☀️', 'Akşam Yemeği': '🌙',
        'Çorba': '🍜', 'Salata': '🥗', 'Aperatif': '🧀',
        'İçecek': '🥤', 'Tatlı': '🍰', 'Diyet': '🥦',
        'Vejetaryen': '🌿', 'Vegan': '🌱', 'Çocuklar': '👶'
    };

    return (
        <div
            className="rounded-2xl border overflow-hidden transition-all duration-300 animate-slide-up"
            style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
                boxShadow: 'var(--shadow-md)',
                animationDelay: `${index * 80}ms`,
                animationFillMode: 'both',
            }}
        >
            {/* Header */}
            <div className="p-4 pb-2">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{
                                backgroundColor: 'var(--bg-chip)',
                                color: 'var(--text-chip)',
                            }}>
                                {categoryEmojis[meal.category] || '🍴'} {meal.category}
                            </span>
                        </div>
                        <h3
                            className="text-base font-semibold leading-tight"
                            style={{ color: 'var(--text-primary)' }}
                        >
                            {meal.name}
                        </h3>
                    </div>

                    <button
                        onClick={handleFavorite}
                        className={`touch-target tap-highlight-none flex items-center justify-center w-11 h-11 rounded-full border-0 cursor-pointer transition-all duration-200 ${animateHeart ? 'animate-pulse-heart' : ''}`}
                        style={{
                            backgroundColor: favorited ? 'var(--color-primary)' : 'var(--bg-chip)',
                            color: favorited ? 'white' : 'var(--color-primary)',
                        }}
                        aria-label={favorited ? 'Favorilerden kaldır' : 'Favorilere ekle'}
                    >
                        <FiHeart
                            size={18}
                            fill={favorited ? 'currentColor' : 'none'}
                        />
                    </button>
                </div>
            </div>



            {/* Expand/Collapse */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full px-4 py-3 flex items-center justify-center gap-1 border-0 cursor-pointer transition-all duration-200 text-sm font-medium tap-highlight-none"
                style={{
                    backgroundColor: 'transparent',
                    color: 'var(--color-primary)',
                    borderTop: '1px solid var(--border-light)',
                }}
            >
                {expanded ? (
                    <>Tarifleri Gizle <FiChevronUp size={16} /></>
                ) : (
                    <>Tarifi Gör <FiChevronDown size={16} /></>
                )}
            </button>

            {/* Recipe */}
            {expanded && (
                <div
                    className="px-4 pb-4 animate-slide-up"
                    style={{ borderTop: '1px solid var(--border-light)' }}
                >
                    <div className="pt-3">
                        <h4
                            className="text-xs font-semibold uppercase tracking-wider mb-2"
                            style={{ color: 'var(--text-tertiary)' }}
                        >
                            Malzemeler
                        </h4>
                        <ul className="space-y-1 mb-4">
                            {meal.ingredients.map((ing, i) => (
                                <li
                                    key={i}
                                    className="text-sm flex items-center gap-2"
                                    style={{ color: 'var(--text-secondary)' }}
                                >
                                    <span style={{ color: 'var(--color-primary)' }}>•</span>
                                    {ing}
                                </li>
                            ))}
                        </ul>

                        <h4
                            className="text-xs font-semibold uppercase tracking-wider mb-2"
                            style={{ color: 'var(--text-tertiary)' }}
                        >
                            Yapılışı
                        </h4>
                        <p
                            className="text-sm leading-relaxed"
                            style={{ color: 'var(--text-secondary)' }}
                        >
                            {meal.recipe}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
