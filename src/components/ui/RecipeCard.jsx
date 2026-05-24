import { useState } from 'react';
import { FiHeart, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useFavorites } from '../../hooks/useFavorites';
import { useComments } from '../../hooks/useComments';
import StarRating from './StarRating';
import CommentSection from './CommentSection';
import { getCategoryDisplayName } from '../../pages/ZarAt';

export default function RecipeCard({ meal, index = 0 }) {
    const [expanded, setExpanded] = useState(false);
    const { toggleFavorite, isFavorite } = useFavorites();
    if (!meal) return null;
    const { averageRating, comments, loading } = useComments(meal.isPersonal ? null : meal.id);
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
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{
                                backgroundColor: 'var(--bg-chip)',
                                color: 'var(--text-chip)',
                            }}>
                                {categoryEmojis[meal?.category] || '🍴'} {getCategoryDisplayName(meal?.category)}
                            </span>
                            {meal.isPersonal && (
                                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold" style={{
                                    backgroundColor: '#8b5cf6',
                                    color: 'white',
                                }}>
                                    Kişisel Tarif
                                </span>
                            )}
                        </div>
                        <h3
                            className="text-base font-semibold leading-tight flex items-center gap-1.5 flex-wrap"
                            style={{ color: 'var(--text-primary)' }}
                        >
                            <span>{meal.name}</span>
                            {!meal.isPersonal && averageRating > 0 && (
                                <span className="inline-flex items-center gap-0.5 text-xs font-normal text-amber-500 ml-1">
                                    ⭐ {averageRating.toFixed(1)}
                                    <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                                        ({comments?.length || 0})
                                    </span>
                                </span>
                            )}
                        </h3>
                    </div>

                    <button
                        onClick={handleFavorite}
                        className={`touch-target tap-highlight-none flex items-center justify-center w-11 h-11 rounded-full border-0 cursor-pointer transition-all duration-200 ${animateHeart ? 'animate-pulse-heart' : ''}`}
                        style={{
                            backgroundColor: favorited ? 'var(--color-primary)' : 'var(--bg-chip)',
                            color: favorited ? 'white' : 'var(--color-primary)',
                        }}
                        aria-label={favorited ? "Favorilerden Çıkar" : "Favoriye Ekle"}
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
                    <>Tarifi Gizle <FiChevronUp size={16} /></>
                ) : (
                    <>Tarifi Göster <FiChevronDown size={16} /></>
                )}
            </button>

            {/* Recipe + Comments */}
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
                            {meal?.ingredients?.map((ing, i) => (
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
                            Hazırlanışı
                        </h4>
                        <p
                            className="text-sm leading-relaxed"
                            style={{ color: 'var(--text-secondary)' }}
                        >
                            {meal?.recipe}
                        </p>

                        {/* Comment Section */}
                        {!meal.isPersonal && (
                            <CommentSection 
                                mealId={meal.id} 
                                mealName={meal.name} 
                                initialComments={comments}
                                initialLoading={loading}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
