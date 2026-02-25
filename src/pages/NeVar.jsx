import { useState, useMemo } from 'react';
import { meals } from '../data/meals';
import { ingredientCategories } from '../data/ingredients';
import RecipeCard from '../components/ui/RecipeCard';
import { FiArrowLeft, FiSearch, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function NeVar() {
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState(null);

    const toggleIngredient = (ingredient) => {
        setSelectedIngredients(prev =>
            prev.includes(ingredient)
                ? prev.filter(i => i !== ingredient)
                : [...prev, ingredient]
        );
    };

    const clearAll = () => {
        setSelectedIngredients([]);
        setSearchQuery('');
    };

    const matchingMeals = useMemo(() => {
        if (selectedIngredients.length === 0) return [];

        return meals
            .map(meal => {
                const matchCount = selectedIngredients.filter(ing =>
                    meal.ingredients.some(mealIng =>
                        mealIng.toLowerCase().includes(ing.toLowerCase())
                    )
                ).length;
                const matchPercent = Math.round((matchCount / selectedIngredients.length) * 100);
                return { ...meal, matchCount, matchPercent };
            })
            .filter(meal => meal.matchCount > 0)
            .sort((a, b) => b.matchPercent - a.matchPercent || b.matchCount - a.matchCount)
            .slice(0, 20);
    }, [selectedIngredients]);

    const filteredCategories = useMemo(() => {
        if (!searchQuery.trim()) return ingredientCategories;

        return ingredientCategories
            .map(cat => ({
                ...cat,
                items: cat.items.filter(item =>
                    item.toLowerCase().includes(searchQuery.toLowerCase())
                ),
            }))
            .filter(cat => cat.items.length > 0);
    }, [searchQuery]);

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
                            🥕 Ne Var?
                        </h1>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                            Elindeki malzemeleri seç, tarif bul!
                        </p>
                    </div>
                </div>

                {/* Selected Ingredients Bar */}
                {selectedIngredients.length > 0 && (
                    <div
                        className="mb-4 p-3 rounded-2xl border animate-slide-up"
                        style={{
                            backgroundColor: 'var(--bg-card)',
                            borderColor: 'var(--border-color)',
                        }}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span
                                className="text-xs font-semibold"
                                style={{ color: 'var(--text-secondary)' }}
                            >
                                Seçilen Malzemeler ({selectedIngredients.length})
                            </span>
                            <button
                                onClick={clearAll}
                                className="text-xs font-medium px-2 py-1 rounded-lg border-0 cursor-pointer transition-colors"
                                style={{
                                    backgroundColor: 'var(--bg-chip)',
                                    color: 'var(--color-primary)',
                                }}
                            >
                                Temizle
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {selectedIngredients.map((ing) => (
                                <button
                                    key={ing}
                                    onClick={() => toggleIngredient(ing)}
                                    className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-full border-0 cursor-pointer font-medium transition-colors"
                                    style={{
                                        backgroundColor: 'var(--bg-chip-active)',
                                        color: 'var(--text-chip-active)',
                                    }}
                                >
                                    {ing}
                                    <FiX size={12} />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Search Input */}
                <div className="relative mb-4 animate-fade-in">
                    <FiSearch
                        className="absolute left-3 top-1/2 -translate-y-1/2"
                        style={{ color: 'var(--text-tertiary)' }}
                        size={18}
                    />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Malzeme ara..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl border outline-none text-sm transition-all duration-200"
                        style={{
                            backgroundColor: 'var(--bg-input)',
                            borderColor: 'var(--border-color)',
                            color: 'var(--text-primary)',
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 border-0 bg-transparent cursor-pointer"
                            style={{ color: 'var(--text-tertiary)' }}
                        >
                            <FiX size={16} />
                        </button>
                    )}
                </div>

                {/* Ingredient Categories */}
                <div
                    className="mb-6 rounded-2xl border overflow-hidden"
                    style={{
                        backgroundColor: 'var(--bg-card)',
                        borderColor: 'var(--border-color)',
                    }}
                >
                    {filteredCategories.map((cat, catIdx) => (
                        <div
                            key={cat.name}
                            style={{
                                borderBottom: catIdx < filteredCategories.length - 1
                                    ? '1px solid var(--border-light)'
                                    : 'none',
                            }}
                        >
                            <button
                                onClick={() => setActiveCategory(activeCategory === cat.name ? null : cat.name)}
                                className="w-full px-4 py-3 flex items-center justify-between border-0 cursor-pointer transition-colors touch-target tap-highlight-none"
                                style={{
                                    backgroundColor: activeCategory === cat.name
                                        ? 'var(--bg-chip)'
                                        : 'transparent',
                                    color: 'var(--text-primary)',
                                }}
                            >
                                <span className="flex items-center gap-2 text-sm font-medium">
                                    <span>{cat.emoji}</span>
                                    {cat.name}
                                    <span
                                        className="text-xs px-1.5 py-0.5 rounded-full"
                                        style={{
                                            backgroundColor: 'var(--bg-chip)',
                                            color: 'var(--text-chip)',
                                        }}
                                    >
                                        {cat.items.length}
                                    </span>
                                </span>
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    className="transition-transform duration-200"
                                    style={{
                                        transform: activeCategory === cat.name ? 'rotate(180deg)' : 'rotate(0)',
                                        color: 'var(--text-tertiary)',
                                    }}
                                >
                                    <path d="M6 9l6 6 6-6" />
                                </svg>
                            </button>

                            {(activeCategory === cat.name || searchQuery) && (
                                <div className="px-4 pb-3 flex flex-wrap gap-1.5 animate-fade-in">
                                    {cat.items.map((item) => {
                                        const isSelected = selectedIngredients.includes(item);
                                        return (
                                            <button
                                                key={item}
                                                onClick={() => toggleIngredient(item)}
                                                className="text-xs px-3 py-1.5 rounded-full border cursor-pointer font-medium transition-all duration-200 tap-highlight-none"
                                                style={{
                                                    backgroundColor: isSelected
                                                        ? 'var(--bg-chip-active)'
                                                        : 'var(--bg-input)',
                                                    color: isSelected
                                                        ? 'var(--text-chip-active)'
                                                        : 'var(--text-secondary)',
                                                    borderColor: isSelected
                                                        ? 'var(--bg-chip-active)'
                                                        : 'var(--border-color)',
                                                }}
                                            >
                                                {item}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Matching Recipes */}
                {selectedIngredients.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2
                                className="text-lg font-semibold"
                                style={{ color: 'var(--text-primary)' }}
                            >
                                🍴 Eşleşen Tarifler
                            </h2>
                            <span
                                className="text-xs px-2.5 py-1 rounded-full font-medium"
                                style={{
                                    backgroundColor: 'var(--bg-chip)',
                                    color: 'var(--text-chip)',
                                }}
                            >
                                {matchingMeals.length} sonuç
                            </span>
                        </div>

                        {matchingMeals.length > 0 ? (
                            <div className="space-y-3">
                                {matchingMeals.map((meal, index) => (
                                    <div key={meal.id} className="relative">
                                        {/* Match badge */}
                                        <div
                                            className="absolute -top-2 right-3 z-10 text-xs font-bold px-2.5 py-0.5 rounded-full"
                                            style={{
                                                backgroundColor: meal.matchPercent === 100
                                                    ? 'var(--color-success)'
                                                    : 'var(--color-accent)',
                                                color: 'white',
                                            }}
                                        >
                                            %{meal.matchPercent} eşleşme
                                        </div>
                                        <RecipeCard meal={meal} index={index} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div
                                className="text-center p-8 rounded-2xl border"
                                style={{
                                    backgroundColor: 'var(--bg-card)',
                                    borderColor: 'var(--border-color)',
                                }}
                            >
                                <div className="text-4xl mb-3">🤔</div>
                                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                    Seçilen malzemelerle eşleşen tarif bulunamadı.
                                    Farklı malzemeler denemeyi dene!
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Initial state */}
                {selectedIngredients.length === 0 && (
                    <div
                        className="text-center p-8 rounded-2xl border animate-fade-in"
                        style={{
                            backgroundColor: 'var(--bg-card)',
                            borderColor: 'var(--border-color)',
                        }}
                    >
                        <div className="text-4xl mb-3">🛒</div>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            Yukarıdaki malzeme kategorilerinden seçim yaparak başla!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
