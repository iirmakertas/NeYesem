import { useState, useMemo, useRef, useEffect } from 'react';
import { meals } from '../data/meals';
import { useMyRecipes } from '../hooks/useMyRecipes';
import { ingredientCategories } from '../data/ingredients';
import RecipeCard from '../components/ui/RecipeCard';
import CameraScanner from '../components/ui/CameraScanner';
import { getCategoryDisplayName } from './ZarAt';
import { FiArrowLeft, FiSearch, FiX, FiBook, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { MdKitchen, MdMenuBook } from 'react-icons/md';
import { Link } from 'react-router-dom';

const recipeCategories = ['Tümü', 'Kahvaltı', 'Öğle Yemeği', 'Akşam Yemeği', 'Çorba', 'Salata', 'Aperatif', 'Tatlı', 'Diyet', 'Vejetaryen', 'Vegan', 'Çocuklar'];

const recipeCategoryEmojis = {
    'Tümü': '🍽️', 'Kahvaltı': '🌅', 'Öğle Yemeği': '☀️', 'Akşam Yemeği': '🌙',
    'Çorba': '🍜', 'Salata': '🥗', 'Aperatif': '🧀',
    'İçecek': '🥤', 'Tatlı': '🍰', 'Diyet': '🥦',
    'Vejetaryen': '🌿', 'Vegan': '🌱', 'Çocuklar': '👶'
};

export default function NeVar() {
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState(null);
    const [source, setSource] = useState('all'); // 'all' | 'mine'
    const [selectedRecipeCategory, setSelectedRecipeCategory] = useState('Tümü');
    const [showScanner, setShowScanner] = useState(false);
    const { recipes: myRecipes, loading: myRecipesLoading } = useMyRecipes();

    // Flatten ingredients list for camera scanner prompt
    const availableIngredients = useMemo(() => {
        return ingredientCategories.flatMap(cat => cat.items);
    }, []);

    const handleScanSuccess = (newIngredients) => {
        setSelectedIngredients(prev => {
            const merged = [...prev];
            newIngredients.forEach(ing => {
                if (!merged.includes(ing)) {
                    merged.push(ing);
                }
            });
            return merged;
        });
    };

    // Normalize personal recipes to match meal format
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
        setSelectedRecipeCategory('Tümü');
    };

    const matchingMeals = useMemo(() => {
        if (selectedIngredients.length === 0) return [];

        const pool = source === 'mine' ? normalizedMyRecipes : [...meals, ...normalizedMyRecipes];

        return pool
            .map(meal => {
                const ingredients = meal.ingredients || [];
                const matchCount = selectedIngredients.filter(ing =>
                    ingredients.some(mealIng =>
                        mealIng && mealIng.toLowerCase().includes(ing.toLowerCase())
                    )
                ).length;
                const matchPercent = Math.round((matchCount / selectedIngredients.length) * 100);
                return { ...meal, matchCount, matchPercent };
            })
            .filter(meal => {
                const matchesIngredients = meal.matchCount > 0;
                const matchesCategory = selectedRecipeCategory === 'Tümü' || meal.category === selectedRecipeCategory;
                return matchesIngredients && matchesCategory;
            })
            .sort((a, b) => b.matchPercent - a.matchPercent || b.matchCount - a.matchCount)
            .slice(0, 20);
    }, [selectedIngredients, source, normalizedMyRecipes, selectedRecipeCategory]);

    const scrollContainerRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const checkScrollLimits = () => {
        const el = scrollContainerRef.current;
        if (!el) return;
        
        setShowLeftArrow(el.scrollLeft > 5);
        const hasMoreToScroll = el.scrollLeft < el.scrollWidth - el.clientWidth - 5;
        setShowRightArrow(hasMoreToScroll);
    };

    useEffect(() => {
        const el = scrollContainerRef.current;
        if (el) {
            checkScrollLimits();
            
            // Check limits again after font loading or layout paint
            const timer = setTimeout(checkScrollLimits, 200);
            
            el.addEventListener('scroll', checkScrollLimits);
            window.addEventListener('resize', checkScrollLimits);
            
            return () => {
                clearTimeout(timer);
                el.removeEventListener('scroll', checkScrollLimits);
                window.removeEventListener('resize', checkScrollLimits);
            };
        }
    }, [matchingMeals]);

    const scrollLeft = () => {
        const el = scrollContainerRef.current;
        if (el) {
            el.scrollBy({ left: -200, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        const el = scrollContainerRef.current;
        if (el) {
            el.scrollBy({ left: 200, behavior: 'smooth' });
        }
    };

    const filteredCategories = useMemo(() => {
        if (!searchQuery.trim()) return ingredientCategories;

        return ingredientCategories
            .map(cat => ({
                ...cat,
                items: cat.items.filter(item => {
                    return item.toLowerCase().includes(searchQuery.toLowerCase());
                }),
            }))
            .filter(cat => cat.items.length > 0);
    }, [searchQuery]);

    const handleSourceChange = (newSource) => {
        setSource(newSource);
        setSelectedIngredients([]);
        setSearchQuery('');
        setSelectedRecipeCategory('Tümü');
    };

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
                            🥕 Ne Var?
                        </h1>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                            Elindeki malzemeleri seç, tarif bul!
                        </p>
                    </div>
                </div>

                {/* Source Toggle */}
                <div
                    className="flex rounded-xl p-1 mb-5 animate-fade-in"
                    style={{
                        backgroundColor: 'var(--bg-input)',
                        border: '1px solid var(--border-color)',
                    }}
                >
                    <button
                        onClick={() => handleSourceChange('all')}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium border-0 cursor-pointer transition-all duration-200"
                        style={{
                            backgroundColor: source === 'all' ? 'var(--color-primary)' : 'transparent',
                            color: source === 'all' ? 'white' : 'var(--text-secondary)',
                            boxShadow: source === 'all' ? 'var(--shadow-md)' : 'none',
                        }}
                    >
                        <MdKitchen size={18} />
                        Tüm Tarifler
                    </button>
                    <button
                        onClick={() => handleSourceChange('mine')}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium border-0 cursor-pointer transition-all duration-200"
                        style={{
                            backgroundColor: source === 'mine' ? 'var(--color-primary)' : 'transparent',
                            color: source === 'mine' ? 'white' : 'var(--text-secondary)',
                            boxShadow: source === 'mine' ? 'var(--shadow-md)' : 'none',
                        }}
                    >
                        <MdMenuBook size={18} />
                        Kendi Tariflerim
                    </button>
                </div>

                {/* Personal recipes loading */}
                {source === 'mine' && myRecipesLoading && (
                    <div className="flex items-center justify-center py-8">
                        <div
                            className="w-8 h-8 border-3 rounded-full animate-spin"
                            style={{ borderColor: 'var(--border-color)', borderTopColor: 'var(--color-primary)' }}
                        />
                    </div>
                )}

                {/* Personal recipes empty state */}
                {source === 'mine' && !myRecipesLoading && normalizedMyRecipes.length === 0 && (
                    <div
                        className="text-center p-8 rounded-2xl border animate-fade-in"
                        style={{
                            backgroundColor: 'var(--bg-card)',
                            borderColor: 'var(--border-color)',
                        }}
                    >
                        <div className="text-4xl mb-3">📖</div>
                        <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                            Tarif defterin henüz boş
                        </h3>
                        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                            Önce Tarif Defterim'e birkaç tarif ekle, sonra malzeme araması yap!
                        </p>
                        <Link
                            to="/tarif-defterim"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white no-underline"
                            style={{ backgroundColor: 'var(--color-primary)' }}
                        >
                            <FiBook size={16} />
                            Tarif Defterime Git
                        </Link>
                    </div>
                )}

                {/* Main content - show when not in personal-empty state */}
                {(source === 'all' || (source === 'mine' && !myRecipesLoading && normalizedMyRecipes.length > 0)) && (
                    <>
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
                                        {source === 'mine' && (
                                            <span className="ml-1" style={{ color: 'var(--text-tertiary)' }}>
                                                🔒 Kendi tariflerinde aranıyor
                                            </span>
                                        )}
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

                        {/* Search Input & Camera Scan */}
                        <div className="flex gap-2 mb-4 animate-fade-in">
                            <div className="relative flex-1">
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
                                    className="w-full pl-10 pr-10 py-3 rounded-xl border outline-none text-sm transition-all duration-200"
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
                            <button
                                onClick={() => setShowScanner(true)}
                                className="touch-target flex items-center justify-center px-4 rounded-xl border-0 cursor-pointer transition-all duration-200"
                                style={{
                                    backgroundColor: 'var(--bg-chip)',
                                    color: 'var(--color-primary)',
                                }}
                                title="Kamera ile Malzeme Tara"
                            >
                                <span className="text-base mr-1.5">📷</span>
                                <span className="text-xs font-bold hidden sm:inline">Tara</span>
                            </button>
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
                                    <div className="flex items-center gap-2">
                                        {source === 'mine' && (
                                            <span
                                                className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                                                style={{ backgroundColor: '#8b5cf6', color: 'white' }}
                                            >
                                                📖 Kendi tarifin
                                            </span>
                                        )}
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
                                </div>

                                {/* Recipe Category Filters Wrapper */}
                                <div className="relative mb-4 group">
                                    {/* Left Arrow Button */}
                                    {showLeftArrow && (
                                        <>
                                            <div 
                                                className="absolute left-0 top-0 bottom-0 w-12 pointer-events-none z-10"
                                                style={{
                                                    background: 'linear-gradient(to right, var(--bg-main) 40%, transparent)'
                                                }}
                                            />
                                            <button
                                                onClick={scrollLeft}
                                                className="absolute left-1 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-8 h-8 rounded-full border shadow-md cursor-pointer transition-all duration-200 hover:scale-105"
                                                style={{
                                                    backgroundColor: 'var(--bg-card)',
                                                    borderColor: 'var(--border-color)',
                                                    color: 'var(--text-primary)',
                                                }}
                                                aria-label="Sola kaydır"
                                            >
                                                <FiChevronLeft size={18} />
                                            </button>
                                        </>
                                    )}

                                    {/* Right Arrow Button */}
                                    {showRightArrow && (
                                        <>
                                            <div 
                                                className="absolute right-0 top-0 bottom-0 w-12 pointer-events-none z-10"
                                                style={{
                                                    background: 'linear-gradient(to left, var(--bg-main) 40%, transparent)'
                                                }}
                                            />
                                            <button
                                                onClick={scrollRight}
                                                className="absolute right-1 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-8 h-8 rounded-full border shadow-md cursor-pointer transition-all duration-200 hover:scale-105"
                                                style={{
                                                    backgroundColor: 'var(--bg-card)',
                                                    borderColor: 'var(--border-color)',
                                                    color: 'var(--text-primary)',
                                                }}
                                                aria-label="Sağa kaydır"
                                            >
                                                <FiChevronRight size={18} />
                                            </button>
                                        </>
                                    )}

                                    {/* Scrolling Container */}
                                    <div 
                                        ref={scrollContainerRef}
                                        className="flex gap-2 overflow-x-auto pb-3 scrollbar-none snap-x scroll-smooth"
                                        style={{
                                            scrollbarWidth: 'none',
                                            msOverflowStyle: 'none',
                                        }}
                                    >
                                        {recipeCategories.map((cat) => {
                                            const isSelected = selectedRecipeCategory === cat;
                                            return (
                                                <button
                                                    key={cat}
                                                    onClick={() => setSelectedRecipeCategory(cat)}
                                                    className="touch-target tap-highlight-none flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-200 whitespace-nowrap snap-start cursor-pointer"
                                                    style={{
                                                        backgroundColor: isSelected ? 'var(--color-primary)' : 'var(--bg-card)',
                                                        borderColor: isSelected ? 'var(--color-primary)' : 'var(--border-color)',
                                                        color: isSelected ? 'white' : 'var(--text-secondary)',
                                                        boxShadow: isSelected ? 'var(--shadow-md)' : 'none',
                                                    }}
                                                >
                                                    <span>{recipeCategoryEmojis[cat] || '🍴'}</span>
                                                    {cat}
                                                </button>
                                            );
                                        })}
                                    </div>
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
                                            {source === 'mine'
                                                ? 'Kendi tariflerinde eşleşen tarif bulunamadı. Farklı malzemeler dene veya "Tüm Tarifler"e geç!'
                                                : 'Seçilen malzemelerle eşleşen tarif bulunamadı. Farklı malzemeler seçmeyi dene!'}
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
                                    {source === 'mine'
                                        ? 'Malzeme seçerek kendi tariflerinde ara!'
                                        : 'Yukarıdaki malzeme kategorilerinden seçim yaparak başla!'}
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>

            <CameraScanner
                show={showScanner}
                onClose={() => setShowScanner(false)}
                onScanSuccess={handleScanSuccess}
                availableIngredients={availableIngredients}
            />
        </div>
    );
}
