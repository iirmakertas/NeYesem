import { useState } from 'react';
import { FiStar } from 'react-icons/fi';

export default function StarRating({ value = 0, onChange, size = 20, readOnly = false }) {
    const [hoverValue, setHoverValue] = useState(0);

    const stars = [1, 2, 3, 4, 5];

    return (
        <div className="flex items-center gap-0.5">
            {stars.map((star) => {
                const filled = readOnly
                    ? star <= Math.round(value)
                    : star <= (hoverValue || value);

                return (
                    <button
                        key={star}
                        type="button"
                        onClick={() => !readOnly && onChange && onChange(star)}
                        onMouseEnter={() => !readOnly && setHoverValue(star)}
                        onMouseLeave={() => !readOnly && setHoverValue(0)}
                        disabled={readOnly}
                        className="border-0 bg-transparent p-0 transition-all duration-150 tap-highlight-none"
                        style={{
                            cursor: readOnly ? 'default' : 'pointer',
                            transform: !readOnly && hoverValue === star ? 'scale(1.2)' : 'scale(1)',
                            color: filled ? '#f59e0b' : 'var(--text-tertiary)',
                            opacity: readOnly ? 0.9 : 1,
                        }}
                        aria-label={`${star} yıldız`}
                    >
                        <FiStar
                            size={size}
                            fill={filled ? '#f59e0b' : 'none'}
                            strokeWidth={filled ? 0 : 2}
                        />
                    </button>
                );
            })}

            {/* Average display for read-only */}
            {readOnly && value > 0 && (
                <span
                    className="text-xs font-semibold ml-1"
                    style={{ color: '#f59e0b' }}
                >
                    {typeof value === 'number' && !isNaN(value) ? value.toFixed(1) : '0.0'}
                </span>
            )}
        </div>
    );
}
