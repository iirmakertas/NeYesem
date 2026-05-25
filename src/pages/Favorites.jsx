import { Link } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites';
import RecipeCard from '../components/ui/RecipeCard';
import { FiArrowLeft, FiHeart } from 'react-icons/fi';

export default function Favorites() {
    const { favorites, loading } = useFavorites();

    return (
        <div className="min-h-screen px-4 pt-6 pb-28 md:py-10" style={{ backgroundColor: 'var(--bg-main)' }}>
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6 animate-fade-in">
                    <Link
                        to="/dashboard"
                        className="touch-target tap-highlight-none flex items-center justify-center w-11 h-11 rounded-full border-0 no-underline transition-colors"
                        style={{
                            backgroundColor: 'var(--bg-chip)',
                            color: 'var(--text-secondary)',
                        }}
                    >
                        <FiArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1
                            className="text-xl md:text-2xl font-bold"
                            style={{ color: 'var(--text-primary)' }}
                        >
                            ❤️ Favoriler
                        </h1>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                            {favorites.length > 0
                                ? `${favorites.length} kayıtlı tarif`
                                : 'Henüz favori tarif yok'}
                        </p>
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex items-center justify-center py-16">
                        <div
                            className="w-8 h-8 border-3 rounded-full animate-spin"
                            style={{
                                borderColor: 'var(--border-color)',
                                borderTopColor: 'var(--color-primary)',
                            }}
                        />
                    </div>
                )}

                {/* Favorites List */}
                {!loading && favorites.length > 0 && (
                    <div className="space-y-3">
                        {favorites.map((fav, index) => {
                            const isPersonal = fav.isPersonal || isNaN(Number(fav.id));
                            return (
                                <RecipeCard
                                    key={fav.id}
                                    meal={{
                                        id: fav.id,
                                        name: fav.name,
                                        category: fav.category,
                                        ingredients: fav.ingredients || [],
                                        recipe: fav.recipe || '',
                                        isPersonal,
                                    }}
                                    index={index}
                                />
                            );
                        })}
                    </div>
                )}

                {/* Empty State */}
                {!loading && favorites.length === 0 && (
                    <div
                        className="text-center p-10 rounded-2xl border animate-fade-in"
                        style={{
                            backgroundColor: 'var(--bg-card)',
                            borderColor: 'var(--border-color)',
                        }}
                    >
                        <div
                            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                            style={{ backgroundColor: 'var(--color-primary-50)' }}
                        >
                            <FiHeart size={32} style={{ color: 'var(--color-primary)' }} />
                        </div>
                        <h3
                            className="text-lg font-semibold mb-2"
                            style={{ color: 'var(--text-primary)' }}
                        >
                            Henüz favori tarif yok
                        </h3>
                        <p
                            className="text-sm mb-6"
                            style={{ color: 'var(--text-secondary)' }}
                        >
                            Tarif kartlarındaki ❤️ ikonuna basarak favori tariflerini burada görebilirsin!
                        </p>
                        <Link
                            to="/zar-at"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white no-underline transition-all duration-200"
                            style={{ backgroundColor: 'var(--color-primary)' }}
                        >
                            🎲 Zar Atarak Keşfet
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
