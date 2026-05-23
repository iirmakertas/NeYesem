import { useState, useEffect, useRef } from 'react';
import { FiCamera, FiX, FiCheck, FiRefreshCw, FiAlertTriangle, FiInfo } from 'react-icons/fi';

// Programmatic Gemini API Key access.
// End-users will never see or configure this in the UI.
// Geliştirici: Kendi Gemini API Anahtarınızı projenin kök dizinindeki .env dosyasına VITE_GEMINI_API_KEY=... şeklinde ekleyin.
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

export default function CameraScanner({ show, onClose, onScanSuccess, availableIngredients }) {
    const [stream, setStream] = useState(null);
    const [cameraActive, setCameraActive] = useState(false);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [detectedItems, setDetectedItems] = useState([]);
    
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    // Initial load and camera toggle
    useEffect(() => {
        if (show) {
            setImage(null);
            setDetectedItems([]);
            setError('');
            startCamera();
        } else {
            stopCamera();
        }

        return () => {
            stopCamera();
        };
    }, [show]);

    const startCamera = async () => {
        setError('');
        setCameraActive(false);
        setImage(null);
        setDetectedItems([]);
        
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                setCameraActive(true);
            }
        } catch (err) {
            console.error("Camera access error:", err);
            setError("Kameraya erişilemedi. Lütfen uygulamanın kamera izinlerini verdiğinizden emin olun.");
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setCameraActive(false);
    };

    const captureAndScan = async () => {
        if (!videoRef.current || !canvasRef.current) return;
        
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        // Match canvas dimensions to video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        const base64Image = dataUrl.split(',')[1];
        
        setImage(dataUrl);
        stopCamera();
        
        if (!GEMINI_API_KEY) {
            setError("Sistem Hatası: Gemini API Anahtarı tanımlanmamış. Lütfen geliştirici olarak .env dosyasına VITE_GEMINI_API_KEY ekleyin.");
            return;
        }
        
        await scanImage(base64Image);
    };

    const scanImage = async (base64Image) => {
        setLoading(true);
        setError('');
        
        try {
            const prompt = `Görseldeki yemek malzemelerini analiz et. Bu malzemeleri SADECE şu liste içindeki öğelerle eşleştirerek Türkçe olarak döndür: ${JSON.stringify(availableIngredients)}. Eşleşen malzemeleri SADECE düz bir JSON string dizisi şeklinde döndür (örn: ["Patlıcan", "Domates"]). Markdown formatı, kod blokları (\`\`\`json vb.) ya da açıklama ekleme, YALNIZCA geçerli bir JSON dizisi döndür. Eşleşen malzeme yoksa boş bir dizi [] döndür.`;

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                { text: prompt },
                                {
                                    inlineData: {
                                        mimeType: 'image/jpeg',
                                        data: base64Image
                                    }
                                }
                            ]
                        }
                    ],
                    generationConfig: {
                        responseMimeType: "application/json"
                    }
                })
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData?.error?.message || `API Hatası: ${response.status}`);
            }

            const data = await response.json();
            const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
            
            if (!textResponse) {
                throw new Error("API'den boş yanıt döndü.");
            }

            let items = JSON.parse(textResponse.trim());
            
            if (Array.isArray(items)) {
                const validItems = items.filter(item => 
                    availableIngredients.some(av => av.toLowerCase() === item.toLowerCase())
                ).map(item => {
                    return availableIngredients.find(av => av.toLowerCase() === item.toLowerCase());
                });

                setDetectedItems(validItems);
                if (validItems.length === 0) {
                    setError("Görseldeki malzemeler bizim listemizdekilerle eşleştirilemedi. Lütfen daha yakından veya daha iyi bir ışıkla tekrar deneyin.");
                }
            } else {
                throw new Error("Geçersiz API yanıt formatı.");
            }
        } catch (err) {
            console.error("Gemini Scan Error:", err);
            setError(err.message || "Görsel taranırken bir hata oluştu. Lütfen internetinizi veya API anahtarınızı kontrol edin.");
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = () => {
        if (detectedItems.length > 0) {
            onScanSuccess(detectedItems);
        }
        onClose();
    };

    if (!show) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4 modal-overlay"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div
                className="w-full max-w-lg rounded-3xl p-6 animate-modal-slide-up overflow-hidden"
                style={{
                    backgroundColor: 'var(--bg-card)',
                    boxShadow: 'var(--shadow-xl)',
                    border: '1px solid var(--border-color)',
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">📷</span>
                        <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                            Kamera ile Malzeme Tara
                        </h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl transition-colors cursor-pointer border-0 flex items-center justify-center"
                            style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-secondary)' }}
                        >
                            <FiX size={16} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black border border-neutral-800">
                        {/* Hidden canvas for capturing image */}
                        <canvas ref={canvasRef} className="hidden" />

                        {/* Camera Feed */}
                        {!image && (
                            <div className="absolute inset-0 w-full h-full">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-full h-full object-cover"
                                />
                                {/* Scan Frame Target Overlay */}
                                {cameraActive && (
                                    <div className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none">
                                        <div className="w-full h-full rounded-2xl border-2 border-dashed animate-scan-border relative">
                                            {/* Corner brackets */}
                                            <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 rounded-tl-lg" style={{ borderColor: 'var(--color-primary)' }} />
                                            <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 rounded-tr-lg" style={{ borderColor: 'var(--color-primary)' }} />
                                            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 rounded-bl-lg" style={{ borderColor: 'var(--color-primary)' }} />
                                            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 rounded-br-lg" style={{ borderColor: 'var(--color-primary)' }} />
                                            
                                            {/* Scanning Laser Animation */}
                                            <div
                                                className="absolute left-0 right-0 h-0.5 animate-laser"
                                                style={{
                                                    background: 'linear-gradient(to right, transparent, var(--color-primary), transparent)',
                                                    boxShadow: '0 0 8px var(--color-primary)'
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                                {/* Bottom Scan Instructions overlay */}
                                {cameraActive && (
                                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] text-white flex items-center gap-1.5 pointer-events-none">
                                        <FiInfo size={12} />
                                        <span>Malzemeyi çerçeve içinde tutun</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Captured Image Preview */}
                        {image && (
                            <img
                                src={image}
                                alt="Captured frame"
                                className="w-full h-full object-cover"
                            />
                        )}

                        {/* Loader Overlay */}
                        {loading && (
                            <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center text-white space-y-3 z-30">
                                <div className="w-10 h-10 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                                <p className="text-sm font-semibold tracking-wide">Yapay Zeka Tarafından Analiz Ediliyor...</p>
                                <p className="text-[11px] text-neutral-400">Gemini malzemeleri tanımlıyor</p>
                            </div>
                        )}

                        {/* Camera Loading/Init State */}
                        {!cameraActive && !image && !error && (
                            <div className="absolute inset-0 flex items-center justify-center bg-neutral-950 text-neutral-400 z-10">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-8 h-8 border-2 border-neutral-700 border-t-neutral-400 rounded-full animate-spin" />
                                    <span className="text-xs">Kamera Başlatılıyor...</span>
                                </div>
                            </div>
                        )}

                        {/* Error text overlay */}
                        {error && (
                            <div className="absolute inset-x-0 bottom-0 bg-red-950/90 text-red-100 p-4 text-xs flex items-start gap-2 border-t border-red-900/50 z-20">
                                <FiAlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="font-semibold mb-0.5">Tarama Hatası</p>
                                    <p className="leading-tight opacity-90">{error}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Camera scan actions */}
                    <div className="space-y-4">
                        {/* Scanning Results / Confirmation */}
                        {detectedItems.length > 0 && !loading && (
                            <div className="p-4 rounded-2xl border animate-fade-in" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                                <div className="flex items-center gap-2 mb-2 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                                    <span className="text-emerald-500">✔</span>
                                    <span>Algılanan Malzemeler:</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5 max-h-[85px] overflow-y-auto scrollbar-thin">
                                    {detectedItems.map((item, i) => (
                                        <span
                                            key={i}
                                            className="text-xs px-2.5 py-1 rounded-full font-medium"
                                            style={{
                                                backgroundColor: 'var(--bg-chip)',
                                                color: 'var(--text-chip)',
                                            }}
                                        >
                                            🌿 {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Actions Buttons */}
                        <div className="flex gap-2">
                            {image ? (
                                <>
                                    <button
                                        onClick={startCamera}
                                        disabled={loading}
                                        className="flex-1 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 border cursor-pointer flex items-center justify-center gap-2"
                                        style={{
                                            backgroundColor: 'var(--bg-input)',
                                            borderColor: 'var(--border-color)',
                                            color: 'var(--text-secondary)',
                                        }}
                                    >
                                        <FiRefreshCw size={16} />
                                        Yeniden Çek
                                    </button>
                                    <button
                                        onClick={handleConfirm}
                                        disabled={loading || detectedItems.length === 0}
                                        className="flex-1 py-3.5 rounded-2xl text-sm font-semibold text-white transition-all duration-200 border-0 cursor-pointer flex items-center justify-center gap-2"
                                        style={{
                                            backgroundColor: detectedItems.length > 0 ? '#22c55e' : 'var(--text-tertiary)',
                                            opacity: detectedItems.length > 0 ? 1 : 0.6,
                                        }}
                                    >
                                        <FiCheck size={18} />
                                        Malzemeleri Ekle
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={captureAndScan}
                                    disabled={!cameraActive}
                                    className="w-full py-4 rounded-2xl text-sm font-bold text-white transition-all duration-200 border-0 cursor-pointer flex items-center justify-center gap-2"
                                    style={{
                                        backgroundColor: cameraActive ? 'var(--color-primary)' : 'var(--text-tertiary)',
                                        boxShadow: cameraActive ? '0 6px 20px rgba(220, 38, 38, 0.3)' : 'none',
                                    }}
                                >
                                    <FiCamera size={18} />
                                    Fotoğrafı Çek ve Tara
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
