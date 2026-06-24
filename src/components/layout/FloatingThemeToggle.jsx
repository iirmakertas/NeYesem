import { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';

const STORAGE_KEY = 'ne-yesem-theme-btn-pos';

export default function FloatingThemeToggle() {
    const { isDark, toggleTheme } = useTheme();

    // Load saved position or default to right side, 40% from top
    const getSavedPos = () => {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
            if (saved && typeof saved.xPct === 'number' && typeof saved.yPct === 'number') {
                return saved;
            }
        } catch (_) { /* ignore */ }
        return { xPct: 0.92, yPct: 0.45 }; // default: right side, ~45% down
    };

    const [pos, setPos] = useState(getSavedPos);
    const [isDragging, setIsDragging] = useState(false);
    const [hasMoved, setHasMoved] = useState(false);

    const btnRef = useRef(null);
    const dragState = useRef(null); // {startX, startY, startPx, startPy, moved}

    const BTN_SIZE = 48;

    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

    // Snap to nearest horizontal edge
    const snapToEdge = useCallback((xPct, yPct) => {
        const snapX = xPct < 0.5 ? 0.04 : 0.92;
        return { xPct: snapX, yPct: clamp(yPct, 0.08, 0.85) };
    }, []);

    const pctToPx = (xPct, yPct) => {
        const W = window.innerWidth;
        const H = window.innerHeight;
        return {
            x: clamp(xPct * W, 0, W - BTN_SIZE),
            y: clamp(yPct * H, 0, H - BTN_SIZE),
        };
    };

    const pxToPct = (x, y) => ({
        xPct: x / window.innerWidth,
        yPct: y / window.innerHeight,
    });

    // ─── Pointer / touch handlers ───────────────────────────────────────────
    const onPointerDown = (e) => {
        e.preventDefault();
        const { x, y } = pctToPx(pos.xPct, pos.yPct);
        dragState.current = {
            startClientX: e.clientX,
            startClientY: e.clientY,
            startPx: x,
            startPy: y,
            moved: false,
        };
        setIsDragging(true);
        setHasMoved(false);
        btnRef.current?.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e) => {
        if (!dragState.current) return;
        const dx = e.clientX - dragState.current.startClientX;
        const dy = e.clientY - dragState.current.startClientY;

        if (!dragState.current.moved && Math.abs(dx) + Math.abs(dy) > 4) {
            dragState.current.moved = true;
            setHasMoved(true);
        }

        if (!dragState.current.moved) return;

        const W = window.innerWidth;
        const H = window.innerHeight;
        const newX = clamp(dragState.current.startPx + dx, 0, W - BTN_SIZE);
        const newY = clamp(dragState.current.startPy + dy, 0, H - BTN_SIZE);
        const { xPct, yPct } = pxToPct(newX, newY);
        setPos({ xPct, yPct });
    };

    const onPointerUp = (e) => {
        if (!dragState.current) return;
        const moved = dragState.current.moved;
        dragState.current = null;
        setIsDragging(false);

        if (moved) {
            // Snap to edge and save
            setPos(prev => {
                const snapped = snapToEdge(prev.xPct, prev.yPct);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(snapped));
                return snapped;
            });
        }
        // If not moved → treat as tap → toggle theme (handled by onClick)
    };

    const handleClick = (e) => {
        if (hasMoved) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        toggleTheme();
    };

    // Reposition on window resize
    useEffect(() => {
        const onResize = () => {
            setPos(prev => {
                const snapped = snapToEdge(prev.xPct, prev.yPct);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(snapped));
                return snapped;
            });
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, [snapToEdge]);

    const { x, y } = pctToPx(pos.xPct, pos.yPct);

    return (
        <button
            ref={btnRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onClick={handleClick}
            className="floating-theme-btn fixed z-[9999] flex items-center justify-center rounded-full border-0 cursor-pointer transition-colors duration-300"
            style={{
                left: x,
                top: y,
                width: BTN_SIZE,
                height: BTN_SIZE,
                backgroundColor: isDark ? 'rgba(69, 26, 26, 0.92)' : 'rgba(255, 255, 255, 0.92)',
                color: isDark ? '#fb923c' : '#dc2626',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: `1.5px solid ${isDark ? 'rgba(239,68,68,0.3)' : 'rgba(220,38,38,0.2)'}`,
                opacity: isDragging ? 0.75 : 1,
                transition: isDragging
                    ? 'none'
                    : 'left 0.35s cubic-bezier(0.34,1.56,0.64,1), top 0.2s ease, opacity 0.2s, background-color 0.3s, color 0.3s',
            }}
            aria-label={isDark ? 'Açık temaya geç' : 'Koyu temaya geç'}
        >
            <div className="relative w-5 h-5 pointer-events-none">
                <FiSun
                    className={`absolute inset-0 transition-all duration-300 ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'}`}
                    size={20}
                />
                <FiMoon
                    className={`absolute inset-0 transition-all duration-300 ${isDark ? 'opacity-0 -rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`}
                    size={20}
                />
            </div>
        </button>
    );
}
