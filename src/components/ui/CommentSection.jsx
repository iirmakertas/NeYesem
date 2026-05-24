import { useState, useRef } from 'react';
import { useComments } from '../../hooks/useComments';
import { useAuth } from '../../context/AuthContext';
import StarRating from './StarRating';
import { FiSend, FiTrash2, FiMessageCircle, FiImage, FiX } from 'react-icons/fi';

export default function CommentSection({ mealId, mealName, initialComments, initialLoading }) {
    const hookData = useComments(mealId);
    const comments = initialComments || hookData.comments;
    const loading = initialLoading !== undefined ? initialLoading : hookData.loading;
    const { addComment, deleteComment, averageRating } = hookData;
    
    const { user } = useAuth();
    const [text, setText] = useState('');
    const [rating, setRating] = useState(0);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [selectedLightboxImage, setSelectedLightboxImage] = useState(null);
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check if it's an image
        if (!file.type.startsWith('image/')) {
            setError('Lütfen geçerli bir görsel dosyası seçin.');
            return;
        }

        // Limit size to 5MB
        if (file.size > 5 * 1024 * 1024) {
            setError('Görsel boyutu en fazla 5MB olabilir.');
            return;
        }

        setError('');
        setImageFile(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (rating === 0) {
            setError('Lütfen bir değerlendirme puanı (yıldız) seçin.');
            return;
        }

        setSubmitting(true);
        try {
            await addComment(text, rating, imageFile);
            setText('');
            setRating(0);
            setImageFile(null);
            setImagePreview(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (err) {
            console.error('Comment submit error:', err);
            setError('Yorum eklenirken bir hata oluştu.');
        }
        setSubmitting(false);
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div
            className="mt-4 pt-4 animate-fade-in"
            style={{ borderTop: '1px solid var(--border-light)' }}
        >
            {/* Section Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <FiMessageCircle size={16} style={{ color: 'var(--color-primary)' }} />
                    <h4
                        className="text-sm font-semibold"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        Yorumlar ({comments?.length || 0})
                    </h4>
                </div>
                {averageRating > 0 && (
                    <StarRating value={averageRating} readOnly size={14} />
                )}
            </div>

            {/* Comment Form */}
            {user && (
                <form onSubmit={handleSubmit} className="mb-4 space-y-3">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                            Puanınız:
                        </span>
                        <StarRating value={rating} onChange={setRating} size={18} />
                    </div>

                    <div className="flex gap-2 items-center">
                        <input
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Tarif hakkında ne düşünüyorsunuz?"
                            className="flex-1 px-3 py-2.5 rounded-xl border outline-none text-sm transition-all duration-200"
                            style={{
                                backgroundColor: 'var(--bg-input)',
                                borderColor: 'var(--border-color)',
                                color: 'var(--text-primary)',
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                        />
                        
                        {/* Hidden File Input */}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            ref={fileInputRef}
                            className="hidden"
                        />
                        
                        {/* Image Select Button */}
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center justify-center w-10 h-10 rounded-xl border cursor-pointer transition-all duration-200 bg-transparent"
                            style={{
                                borderColor: imageFile ? 'var(--color-primary)' : 'var(--border-color)',
                                color: imageFile ? 'var(--color-primary)' : 'var(--text-secondary)',
                            }}
                            title="Fotoğraf Ekle"
                        >
                            <FiImage size={18} />
                        </button>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex items-center justify-center w-10 h-10 rounded-xl border-0 cursor-pointer transition-all duration-200"
                            style={{
                                backgroundColor: submitting ? 'var(--text-tertiary)' : 'var(--color-primary)',
                                color: 'white',
                            }}
                        >
                            {submitting ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <FiSend size={16} />
                            )}
                        </button>
                    </div>

                    {/* Image Preview Container */}
                    {imagePreview && (
                        <div className="relative inline-block mt-2 animate-scale-in">
                            <img
                                src={imagePreview}
                                alt="Seçilen Görsel Önizleme"
                                className="w-20 h-20 object-cover rounded-xl border"
                                style={{ borderColor: 'var(--border-color)' }}
                            />
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center border-0 cursor-pointer hover:bg-red-600 transition-colors shadow-sm"
                            >
                                <FiX size={12} />
                            </button>
                        </div>
                    )}

                    {error && (
                        <p className="text-xs animate-fade-in" style={{ color: 'var(--color-primary)' }}>
                            {error}
                        </p>
                    )}
                </form>
            )}

            {/* Comments List */}
            {loading ? (
                <div className="flex items-center justify-center py-4">
                    <div
                        className="w-5 h-5 border-2 rounded-full animate-spin"
                        style={{
                            borderColor: 'var(--border-color)',
                            borderTopColor: 'var(--color-primary)',
                        }}
                    />
                </div>
            ) : comments.length > 0 ? (
                <div className="space-y-3">
                    {comments.map((comment) => (
                        <div
                            key={comment.id}
                            className="p-3 rounded-xl transition-colors"
                            style={{
                                backgroundColor: 'var(--bg-input)',
                                border: '1px solid var(--border-light)',
                            }}
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span
                                            className="text-xs font-semibold"
                                            style={{ color: 'var(--color-primary)' }}
                                        >
                                            {comment.username}
                                        </span>
                                        <StarRating value={comment.rating} readOnly size={12} />
                                    </div>
                                    {comment.text && (
                                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                            {comment.text}
                                        </p>
                                    )}
                                    
                                    {/* Render Comment Image */}
                                    {comment.imageUrl && (
                                        <div className="mt-2 inline-block rounded-xl overflow-hidden border cursor-zoom-in hover:opacity-90 transition-opacity" style={{ borderColor: 'var(--border-light)' }}>
                                            <img
                                                src={comment.imageUrl}
                                                alt={`${comment.username} yorum fotoğrafı`}
                                                onClick={() => setSelectedLightboxImage(comment.imageUrl)}
                                                className="max-h-32 max-w-[200px] object-cover block"
                                            />
                                        </div>
                                    )}

                                    <span
                                        className="text-[10px] mt-1 block"
                                        style={{ color: 'var(--text-tertiary)' }}
                                    >
                                        {formatDate(comment.createdAt)}
                                    </span>
                                </div>

                                {/* Delete button (only for comment owner) */}
                                {user && user.uid === comment.userId && (
                                    <button
                                        onClick={() => {
                                            if (window.confirm('Bu yorumu silmek istediğinizden emin misiniz?')) {
                                                deleteComment(comment.id, comment.imageStoragePath);
                                            }
                                        }}
                                        className="flex-shrink-0 p-1.5 rounded-lg border-0 cursor-pointer transition-colors bg-transparent"
                                        style={{ color: 'var(--text-tertiary)' }}
                                        title="Yorumu sil"
                                    >
                                        <FiTrash2 size={13} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p
                    className="text-xs text-center py-3"
                    style={{ color: 'var(--text-tertiary)' }}
                >
                    Henüz yorum yapılmamış. 💬
                </p>
            )}

            {/* Lightbox Modal */}
            {selectedLightboxImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in p-4"
                    onClick={() => setSelectedLightboxImage(null)}
                >
                    <button
                        onClick={() => setSelectedLightboxImage(null)}
                        className="absolute top-4 right-4 p-2 rounded-xl text-white hover:text-neutral-300 transition-colors border-0 bg-black/40 cursor-pointer flex items-center justify-center"
                    >
                        <FiX size={20} />
                    </button>
                    <img
                        src={selectedLightboxImage}
                        alt="Yorum görseli tam ekran"
                        className="max-w-full max-h-[85vh] object-contain rounded-2xl animate-scale-in"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
}
