import { useState, useCallback, useMemo } from 'react';
import { meals } from '../data/meals';
import { useMyRecipes } from '../hooks/useMyRecipes';
import RecipeCard from '../components/ui/RecipeCard';
import { GiRollingDices } from 'react-icons/gi';
import { FiArrowLeft, FiBook } from 'react-icons/fi';
import { MdMenuBook } from 'react-icons/md';
import { Link } from 'react-router-dom';

const categories = [
    { name: 'Kahvaltı', emoji: '🌅' },
    { name: 'Öğle Yemeği', emoji: '☀️' },
    { name: 'Akşam Yemeği', emoji: '🌙' },
    { name: 'Çorba', emoji: '🍜' },
    { name: 'Salata', emoji: '🥗' },
    { name: 'Aperatif', emoji: '🧀' },
    { name: 'İçecek', emoji: '🥤' },
    { name: 'Tatlı', emoji: '🍰' },
    { name: 'Diyet', emoji: '🥦' },
    { name: 'Vejetaryen', emoji: '🌿' },
    { name: 'Vegan', emoji: '🌱' },
    { name: 'Çocuklar', emoji: '👶' },
];

export const getCategoryDisplayName = (catName) => {
    return catName;
};

export default function ZarAt() {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [randomMeal, setRandomMeal] = useState(null);
    const [rolling, setRolling] = useState(false);
    const [source, setSource] = useState('all'); // 'all' | 'mine'
    const { recipes: myRecipes, loading: myRecipesLoading } = useMyRecipes();

    // Normalize personal recipes to match meal format (name, id, ingredients, recipe, category)
    const normalizedMyRecipes = useMemo(() => {
        return myRecipes.map(r => ({
            id: r.id,
            name: r.title,
            category: r.category,
            ingredients: r.ingredients || [],
            recipe: r.recipe || '',
            isPersonal: true,
        }));
    }, [myRecipes]);

    // Get available categories for personal recipes
    const myRecipeCategories = useMemo(() => {
        return [...new Set(normalizedMyRecipes.map(r => r.category))];
    }, [normalizedMyRecipes]);

    const rollDice = useCallback(() => {
        if (!selectedCategory) return;

        const pool = source === 'mine'
            ? normalizedMyRecipes.filter(m => m.category === selectedCategory)
            : [...meals, ...normalizedMyRecipes].filter(m => m.category === selectedCategory);

        if (pool.length === 0) {
            setRolling(false);
            return;
        }

        setRolling(true);
        setRandomMeal(null);

        // Fun rolling effect
        let count = 0;
        const interval = setInterval(() => {
            const rand = pool[Math.floor(Math.random() * pool.length)];
            setRandomMeal(rand);
            count++;
            if (count >= 8) {
                clearInterval(interval);
                const final = pool[Math.floor(Math.random() * pool.length)];
                setRandomMeal(final);
                setRolling(false);
            }
        }, 100);
    }, [selectedCategory, source, normalizedMyRecipes]);

    const handleSourceChange = (newSource) => {
        setSource(newSource);
        setSelectedCategory(null);
        setRandomMeal(null);
    };

    // Filter categories based on source
    const currentCategories = useMemo(() => {
        if (source === 'all') return categories;
        return categories.filter(c => myRecipeCategories.includes(c.name));
    }, [source, myRecipeCategories]);

    return (
        <div className="min-h-screen px-4 py-6 md:py-10" style={{ backgroundColor: 'var(--bg-main)' }}>
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
                            🎲 Zar At
                        </h1>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                            Kategorilere göre şansına ne çıkacağını gör!
                        </p>
                    </div>
                </div>

                {/* Source Selector */}
                <div
                    className="flex rounded-xl p-1 mb-6 animate-fade-in"
                    style={{
                        backgroundColor: 'var(--bg-input)',
                        border: '1px solid var(--border-color)',
                    }}
                >
                    <button
                        onClick={() => handleSourceChange('all')}
                        className="flex-1 py-2.5 rounded-lg text-sm font-semibold border-0 cursor-pointer transition-all duration-200"
                        style={{
                            backgroundColor: source === 'all' ? 'var(--color-primary)' : 'transparent',
                            color: source === 'all' ? 'white' : 'var(--text-secondary)',
                            boxShadow: source === 'all' ? 'var(--shadow-md)' : 'none',
                        }}
                    >
                        Tüm Tarifler
                    </button>
                    <button
                        onClick={() => handleSourceChange('mine')}
                        className="flex-1 py-2.5 rounded-lg text-sm font-semibold border-0 cursor-pointer transition-all duration-200"
                        style={{
                            backgroundColor: source === 'mine' ? 'var(--color-primary)' : 'transparent',
                            color: source === 'mine' ? 'white' : 'var(--text-secondary)',
                            boxShadow: source === 'mine' ? 'var(--shadow-md)' : 'none',
                        }}
                    >
                        Sadece Benim Tariflerim
                    </button>
                </div>

                {/* Personal recipes loading */}
                {source === 'mine' && myRecipesLoading && (
                    <div className="flex items-center justify-center py-16">
                        <div
                            className="w-8 h-8 border-3 rounded-full animate-spin"
                            style={{ borderColor: 'var(--border-color)', borderTopColor: 'var(--color-primary)' }}
                        />
                    </div>
                )}

                {/* Empty State for Personal Recipes */}
                {source === 'mine' && !myRecipesLoading && normalizedMyRecipes.length === 0 && (
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
                            <MdMenuBook size={32} style={{ color: 'var(--color-primary)' }} />
                        </div>
                        <h3
                            className="text-lg font-semibold mb-2"
                            style={{ color: 'var(--text-primary)' }}
                        >
                            Tarif defterin henüz boş
                        </h3>
                        <p
                            className="text-sm mb-6"
                            style={{ color: 'var(--text-secondary)' }}
                        >
                            Kendi tariflerinden seçip zar atmak için önce tarif ekle.
                        </p>
                        <Link
                            to="/tarif-defterim"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white no-underline transition-all duration-200"
                            style={{ backgroundColor: 'var(--color-primary)' }}
                        >
                            <FiBook size={16} />
                            Tarif Defterime Git
                        </Link>
                    </div>
                )}

                {/* Categories Grid */}
                {(source === 'all' || (source === 'mine' && !myRecipesLoading && currentCategories.length > 0)) && (
                    <>
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-2.5 mb-6">
                            {currentCategories.map((cat, index) => (
                                <button
                                    key={cat.name}
                                    onClick={() => {
                                        setSelectedCategory(cat.name);
                                        setRandomMeal(null);
                                    }}
                                    className="touch-target tap-highlight-none flex flex-col items-center gap-1.5 p-3 rounded-xl border-0 cursor-pointer transition-all duration-200 animate-scale-in"
                                    style={{
                                        backgroundColor: selectedCategory === cat.name ? 'var(--color-primary)' : 'var(--bg-card)',
                                        color: selectedCategory === cat.name ? 'white' : 'var(--text-primary)',
                                        boxShadow: selectedCategory === cat.name ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
                                        animationDelay: `${index * 50}ms`,
                                        animationFillMode: 'both',
                                        border: selectedCategory === cat.name ? 'none' : '1px solid var(--border-color)',
                                    }}
                                >
                                    <span className="text-2xl">{cat.emoji}</span>
                                    <span className="text-xs font-medium leading-tight text-center">
                                        {cat.name}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Roll Button */}
                        {selectedCategory && (
                            <div className="mb-8 animate-slide-up">
                                <button
                                    onClick={rollDice}
                                    disabled={rolling}
                                    className="touch-target w-full py-4 rounded-2xl text-base font-bold text-white border-0 cursor-pointer transition-all duration-200 flex items-center justify-center gap-3"
                                    style={{
                                        background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
                                        boxShadow: '0 8px 24px rgba(220, 38, 38, 0.35)',
                                        opacity: rolling ? 0.8 : 1,
                                    }}
                                >
                                    <GiRollingDices
                                        size={28}
                                        className={rolling ? 'animate-dice' : ''}
                                    />
                                    {rolling 
                                        ? 'Zar Atılıyor...' 
                                        : `${selectedCategory} İçin Zar At!`}
                                </button>
                                {source === 'mine' && (
                                    <p className="text-[11px] text-center mt-2" style={{ color: 'var(--text-tertiary)' }}>
                                        🔒 Sadece kendi tariflerinden seçiliyor
                                    </p>
                                )}
                            </div>
                        )}
                    </>
                )}

                {/* Result */}
                {randomMeal && !rolling && (
                    <div className="animate-scale-in">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-lg">🎯</span>
                            <h2
                                className="text-lg font-semibold"
                                style={{ color: 'var(--text-primary)' }}
                            >
                                İşte sana bir tarif!
                            </h2>
                            {randomMeal.isPersonal && (
                                <span
                                    className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                                    style={{ backgroundColor: '#8b5cf6', color: 'white' }}
                                >
                                    📖 Kendi tarifin
                                </span>
                            )}
                        </div>
                        <RecipeCard meal={randomMeal} />
                    </div>
                )}

                {/* Hint text when no category selected */}
                {!selectedCategory && source === 'all' && (
                    <div
                        className="text-center p-8 rounded-2xl border animate-fade-in"
                        style={{
                            backgroundColor: 'var(--bg-card)',
                            borderColor: 'var(--border-color)',
                        }}
                    >
                        <div className="text-4xl mb-3">🎯</div>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            Yukarıdan bir kategori seçerek başla!
                        </p>
                    </div>
                )}

                {!selectedCategory && source === 'mine' && !myRecipesLoading && currentCategories.length > 0 && (
                    <div
                        className="text-center p-8 rounded-2xl border animate-fade-in"
                        style={{
                            backgroundColor: 'var(--bg-card)',
                            borderColor: 'var(--border-color)',
                        }}
                    >
                        <div className="text-4xl mb-3">📖</div>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            Kendi tariflerinden bir kategori seç!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
