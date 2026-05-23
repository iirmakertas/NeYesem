import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMyRecipes } from '../hooks/useMyRecipes';
import { useFavorites } from '../hooks/useFavorites';
import { FiArrowLeft, FiPlus, FiEdit2, FiTrash2, FiX, FiChevronDown, FiChevronUp, FiBook, FiHeart } from 'react-icons/fi';
import { getCategoryDisplayName } from './ZarAt';

const categories = [
    'Kahvaltı', 'Öğle Yemeği', 'Akşam Yemeği', 'Çorba', 'Salata',
    'Aperatif', 'İçecek', 'Tatlı', 'Diyet', 'Vejetaryen', 'Vegan', 'Çocuklar'
];

const categoryEmojis = {
    'Kahvaltı': '🌅', 'Öğle Yemeği': '☀️', 'Akşam Yemeği': '🌙',
    'Çorba': '🍜', 'Salata': '🥗', 'Aperatif': '🧀',
    'İçecek': '🥤', 'Tatlı': '🍰', 'Diyet': '🥦',
    'Vejetaryen': '🌿', 'Vegan': '🌱', 'Çocuklar': '👶'
};

// ─── Add/Edit Recipe Modal ───
function RecipeFormModal({ show, onClose, onSubmit, initialData, loading }) {
    const [title, setTitle] = useState(initialData?.title || '');
    const [category, setCategory] = useState(initialData?.category || 'Kahvaltı');
    const [ingredientsText, setIngredientsText] = useState(
        initialData?.ingredients?.join('\n') || ''
    );
    const [recipe, setRecipe] = useState(initialData?.recipe || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        const ingredients = ingredientsText
            .split('\n')
            .map(i => i.trim())
            .filter(i => i.length > 0);

        onSubmit({
            title: title.trim(),
            category,
            ingredients,
            recipe: recipe.trim(),
        });
    };

    if (!show) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4 modal-overlay"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div
                className="w-full max-w-lg rounded-2xl p-6 animate-modal-slide-up max-h-[90vh] overflow-y-auto scrollbar-thin"
                style={{
                    backgroundColor: 'var(--bg-card)',
                    boxShadow: 'var(--shadow-xl)',
                    border: '1px solid var(--border-color)',
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {initialData ? '📝 Tarifi Düzenle' : '✨ Yeni Tarif Ekle'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl transition-colors cursor-pointer border-0"
                        style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-secondary)' }}
                    >
                        <FiX size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                            Tarif Adı
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Örn: Anneannemin Böreği"
                            required
                            className="w-full px-4 py-3 rounded-xl border outline-none text-sm transition-all duration-200"
                            style={{
                                backgroundColor: 'var(--bg-input)',
                                borderColor: 'var(--border-color)',
                                color: 'var(--text-primary)',
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                            Kategori
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border outline-none text-sm transition-all duration-200 cursor-pointer"
                            style={{
                                backgroundColor: 'var(--bg-input)',
                                borderColor: 'var(--border-color)',
                                color: 'var(--text-primary)',
                            }}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>
                                    {categoryEmojis[cat]} {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Ingredients */}
                    <div>
                        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                            Malzemeler <span className="text-xs font-normal" style={{ color: 'var(--text-tertiary)' }}>(her satıra bir malzeme)</span>
                        </label>
                        <textarea
                            value={ingredientsText}
                            onChange={(e) => setIngredientsText(e.target.value)}
                            placeholder="2 adet yumurta&#10;1 su bardağı un&#10;1 çay kaşığı tuz"
                            required
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl border outline-none text-sm transition-all duration-200 resize-y"
                            style={{
                                backgroundColor: 'var(--bg-input)',
                                borderColor: 'var(--border-color)',
                                color: 'var(--text-primary)',
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                        />
                    </div>

                    {/* Recipe Instructions */}
                    <div>
                        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                            Hazırlanışı
                        </label>
                        <textarea
                            value={recipe}
                            onChange={(e) => setRecipe(e.target.value)}
                            placeholder="Tarifi adım adım yazın..."
                            required
                            rows={5}
                            className="w-full px-4 py-3 rounded-xl border outline-none text-sm transition-all duration-200 resize-y"
                            style={{
                                backgroundColor: 'var(--bg-input)',
                                borderColor: 'var(--border-color)',
                                color: 'var(--text-primary)',
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 cursor-pointer border-0 flex items-center justify-center gap-2"
                        style={{
                            backgroundColor: loading ? 'var(--text-tertiary)' : 'var(--color-primary)',
                            opacity: loading ? 0.7 : 1,
                        }}
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                {initialData ? <FiEdit2 size={16} /> : <FiPlus size={16} />}
                                {initialData ? 'Güncelle' : 'Tarifi Ekle'}
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

// ─── Delete Confirmation Modal ───
function DeleteConfirmModal({ show, onClose, onConfirm, recipeName }) {
    if (!show) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4 modal-overlay"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div
                className="w-full max-w-sm rounded-2xl p-6 animate-modal-slide-up text-center"
                style={{
                    backgroundColor: 'var(--bg-card)',
                    boxShadow: 'var(--shadow-xl)',
                    border: '1px solid var(--border-color)',
                }}
            >
                <div className="text-4xl mb-3">🗑️</div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Tarifi Sil
                </h3>
                <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                    <strong>"{recipeName}"</strong> tarifini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl text-sm font-medium border cursor-pointer transition-colors"
                        style={{
                            backgroundColor: 'var(--bg-input)',
                            borderColor: 'var(--border-color)',
                            color: 'var(--text-secondary)',
                        }}
                    >
                        Vazgeç
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-3 rounded-xl text-sm font-semibold text-white cursor-pointer border-0 transition-colors"
                        style={{ backgroundColor: '#ef4444' }}
                    >
                        Sil
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── My Recipe Card ───
function MyRecipeCard({ recipe, onEdit, onDelete, index }) {
    const [expanded, setExpanded] = useState(false);
    const { toggleFavorite, isFavorite } = useFavorites();
    const [animateHeart, setAnimateHeart] = useState(false);
    const favorited = isFavorite(recipe.id);

    const handleFavorite = async (e) => {
        e.stopPropagation();
        setAnimateHeart(true);
        const meal = {
            id: recipe.id,
            name: recipe.title,
            category: recipe.category,
            ingredients: recipe.ingredients || [],
            recipe: recipe.recipe || '',
            isPersonal: true,
        };
        await toggleFavorite(meal);
        setTimeout(() => setAnimateHeart(false), 400);
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
                                {categoryEmojis[recipe.category] || '🍴'} {recipe.category}
                            </span>
                        </div>
                        <h3
                            className="text-base font-semibold leading-tight"
                            style={{ color: 'var(--text-primary)' }}
                        >
                            {recipe.title}
                        </h3>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={handleFavorite}
                            className={`flex items-center justify-center w-9 h-9 rounded-full border-0 cursor-pointer transition-all duration-200 ${animateHeart ? 'animate-pulse-heart' : ''}`}
                            style={{
                                backgroundColor: favorited ? 'var(--color-primary)' : 'var(--bg-chip)',
                                color: favorited ? 'white' : 'var(--color-primary)',
                            }}
                            title={favorited ? 'Favorilerden kaldır' : 'Favorilere ekle'}
                        >
                            <FiHeart
                                size={15}
                                fill={favorited ? 'currentColor' : 'none'}
                            />
                        </button>
                        <button
                            onClick={() => onEdit(recipe)}
                            className="flex items-center justify-center w-9 h-9 rounded-full border-0 cursor-pointer transition-all duration-200"
                            style={{
                                backgroundColor: 'var(--bg-chip)',
                                color: 'var(--color-primary)',
                            }}
                            title="Düzenle"
                        >
                            <FiEdit2 size={15} />
                        </button>
                        <button
                            onClick={() => onDelete(recipe)}
                            className="flex items-center justify-center w-9 h-9 rounded-full border-0 cursor-pointer transition-all duration-200"
                            style={{
                                backgroundColor: 'var(--bg-chip)',
                                color: '#ef4444',
                            }}
                            title="Sil"
                        >
                            <FiTrash2 size={15} />
                        </button>
                    </div>
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

            {/* Recipe Content */}
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
                            {recipe.ingredients?.map((ing, i) => (
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
                            {recipe.recipe}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Main Page ───
export default function TarifDefterim() {
    const { recipes, loading, addRecipe, updateRecipe, deleteRecipe } = useMyRecipes();
    const [showFormModal, setShowFormModal] = useState(false);
    const [editingRecipe, setEditingRecipe] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [formLoading, setFormLoading] = useState(false);
    const [filterCategory, setFilterCategory] = useState('Tümü');

    const handleAdd = async (recipeData) => {
        setFormLoading(true);
        try {
            await addRecipe(recipeData);
            setShowFormModal(false);
        } catch (err) {
            console.error('Add recipe error:', err);
        }
        setFormLoading(false);
    };

    const handleEdit = (recipe) => {
        setEditingRecipe(recipe);
        setShowFormModal(true);
    };

    const handleUpdate = async (recipeData) => {
        setFormLoading(true);
        try {
            await updateRecipe(editingRecipe.id, recipeData);
            setShowFormModal(false);
            setEditingRecipe(null);
        } catch (err) {
            console.error('Update recipe error:', err);
        }
        setFormLoading(false);
    };

    const handleDeleteConfirm = async () => {
        try {
            await deleteRecipe(deleteTarget.id);
            setDeleteTarget(null);
        } catch (err) {
            console.error('Delete recipe error:', err);
        }
    };

    const closeFormModal = () => {
        setShowFormModal(false);
        setEditingRecipe(null);
    };

    const filteredRecipes = filterCategory === 'Tümü'
        ? recipes
        : recipes.filter(r => r.category === filterCategory);

    const usedCategories = ['Tümü', ...new Set(recipes.map(r => r.category))];

    return (
        <div className="min-h-screen px-4 py-6 md:py-10" style={{ backgroundColor: 'var(--bg-main)' }}>
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 animate-fade-in">
                    <div className="flex items-center gap-3">
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
                                📖 Tarif Defterim
                            </h1>
                            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                {recipes.length > 0
                                    ? `${recipes.length} kişisel tarif`
                                    : 'Kendi tariflerini ekle!'}
                            </p>
                        </div>
                    </div>

                    {/* Add Button */}
                    <button
                        onClick={() => setShowFormModal(true)}
                        className="touch-target flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white border-0 cursor-pointer transition-all duration-200"
                        style={{
                            backgroundColor: 'var(--color-primary)',
                            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
                        }}
                    >
                        <FiPlus size={18} />
                        <span className="hidden sm:inline">Yeni Tarif</span>
                    </button>
                </div>

                {/* Category Filter */}
                {recipes.length > 0 && usedCategories.length > 2 && (
                    <div className="flex gap-2 mb-5 overflow-x-auto pb-1 scrollbar-thin animate-fade-in">
                        {usedCategories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilterCategory(cat)}
                                className="text-xs px-3 py-1.5 rounded-full border cursor-pointer font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0"
                                style={{
                                    backgroundColor: filterCategory === cat ? 'var(--bg-chip-active)' : 'var(--bg-input)',
                                    color: filterCategory === cat ? 'var(--text-chip-active)' : 'var(--text-secondary)',
                                    borderColor: filterCategory === cat ? 'var(--bg-chip-active)' : 'var(--border-color)',
                                }}
                            >
                                {cat === 'Tümü' ? '📚 Tümü' : `${categoryEmojis[cat] || '🍴'} ${cat}`}
                            </button>
                        ))}
                    </div>
                )}

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

                {/* Recipe List */}
                {!loading && filteredRecipes.length > 0 && (
                    <div className="space-y-3">
                        {filteredRecipes.map((recipe, index) => (
                            <MyRecipeCard
                                key={recipe.id}
                                recipe={recipe}
                                index={index}
                                onEdit={handleEdit}
                                onDelete={(r) => setDeleteTarget(r)}
                            />
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && recipes.length === 0 && (
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
                            <FiBook size={32} style={{ color: 'var(--color-primary)' }} />
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
                            Kendi özel tariflerini ekleyerek dijital tarif defterini oluşturmaya başla!
                        </p>
                        <button
                            onClick={() => setShowFormModal(true)}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white border-0 cursor-pointer transition-all duration-200"
                            style={{ backgroundColor: 'var(--color-primary)' }}
                        >
                            <FiPlus size={18} />
                            İlk Tarifini Ekle
                        </button>
                    </div>
                )}

                {/* No filter results */}
                {!loading && recipes.length > 0 && filteredRecipes.length === 0 && (
                    <div
                        className="text-center p-8 rounded-2xl border"
                        style={{
                            backgroundColor: 'var(--bg-card)',
                            borderColor: 'var(--border-color)',
                        }}
                    >
                        <div className="text-4xl mb-3">🔍</div>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            Bu kategoride henüz tarif yok.
                        </p>
                    </div>
                )}
            </div>

            {/* Form Modal */}
            <RecipeFormModal
                show={showFormModal}
                onClose={closeFormModal}
                onSubmit={editingRecipe ? handleUpdate : handleAdd}
                initialData={editingRecipe}
                loading={formLoading}
            />

            {/* Delete Confirmation */}
            <DeleteConfirmModal
                show={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDeleteConfirm}
                recipeName={deleteTarget?.title}
            />
        </div>
    );
}
