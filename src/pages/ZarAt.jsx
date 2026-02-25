import { useState, useCallback } from 'react';
import { meals } from '../data/meals';
import RecipeCard from '../components/ui/RecipeCard';
import { GiRollingDices } from 'react-icons/gi';
import { FiArrowLeft } from 'react-icons/fi';
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

export default function ZarAt() {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [randomMeal, setRandomMeal] = useState(null);
    const [rolling, setRolling] = useState(false);

    const rollDice = useCallback(() => {
        if (!selectedCategory) return;

        setRolling(true);
        setRandomMeal(null);

        const categoryMeals = meals.filter(m => m.category === selectedCategory);
        if (categoryMeals.length === 0) {
            setRolling(false);
            return;
        }

        // Fun rolling effect - change meals quickly before settling
        let count = 0;
        const interval = setInterval(() => {
            const rand = categoryMeals[Math.floor(Math.random() * categoryMeals.length)];
            setRandomMeal(rand);
            count++;
            if (count >= 8) {
                clearInterval(interval);
                const final = categoryMeals[Math.floor(Math.random() * categoryMeals.length)];
                setRandomMeal(final);
                setRolling(false);
            }
        }, 100);
    }, [selectedCategory]);

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
                            Bir kategori seç ve zarı at!
                        </p>
                    </div>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2.5 mb-6">
                    {categories.map((cat, index) => (
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
                            <span className="text-xs font-medium leading-tight text-center">{cat.name}</span>
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
                            {rolling ? 'Zar Atılıyor...' : `${selectedCategory} İçin Zar At!`}
                        </button>
                    </div>
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
                        </div>
                        <RecipeCard meal={randomMeal} />
                    </div>
                )}

                {/* Hint text when no category selected */}
                {!selectedCategory && (
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
            </div>
        </div>
    );
}
