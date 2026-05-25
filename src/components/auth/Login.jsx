import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMail, FiLock, FiLogIn, FiAlertCircle, FiCheckCircle, FiX, FiSend, FiLogOut } from 'react-icons/fi';

// ─── Snackbar Component ───
function Snackbar({ show, type, message, onClose }) {
    const [visible, setVisible] = useState(false);
    const [exiting, setExiting] = useState(false);

    useEffect(() => {
        if (show) {
            setVisible(true);
            setExiting(false);
            const timer = setTimeout(() => {
                setExiting(true);
                setTimeout(() => {
                    setVisible(false);
                    setExiting(false);
                    onClose();
                }, 400);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    if (!visible) return null;

    const isSuccess = type === 'success';
    const bgColor = isSuccess ? '#22c55e' : '#ef4444';
    const Icon = isSuccess ? FiCheckCircle : FiAlertCircle;

    return (
        <div
            className={`fixed bottom-6 left-1/2 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl text-white text-sm font-medium ${exiting ? 'animate-snackbar-out' : 'animate-snackbar-in'}`}
            style={{
                transform: 'translateX(-50%)',
                backgroundColor: bgColor,
                boxShadow: `0 8px 32px ${bgColor}44, 0 4px 12px rgba(0,0,0,0.15)`,
                maxWidth: 'calc(100vw - 2rem)',
                minWidth: '320px',
            }}
        >
            <Icon size={20} className="flex-shrink-0" />
            <span className="flex-1">{message}</span>
            <button
                onClick={() => {
                    setExiting(true);
                    setTimeout(() => { setVisible(false); onClose(); }, 400);
                }}
                className="flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors cursor-pointer border-0 bg-transparent text-white"
            >
                <FiX size={16} />
            </button>
        </div>
    );
}

// ─── Forgot Password Modal ───
function ForgotPasswordModal({ show, onClose, resetPassword }) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            await resetPassword(email);
            setStatus({
                type: 'success',
                message: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi!',
            });
            setEmail('');
        } catch (err) {
            const messages = {
                'auth/user-not-found': 'Bu e-posta ile kayıtlı bir hesap bulunamadı.',
                'auth/invalid-email': 'Geçersiz e-posta adresi.',
                'auth/too-many-requests': 'Çok fazla deneme. Lütfen biraz bekleyin.',
            };
            setStatus({
                type: 'error',
                message: messages[err.code] || 'Bir hata oluştu. Lütfen tekrar deneyin.',
            });
        }
        setLoading(false);
    };

    const handleClose = () => {
        setEmail('');
        setStatus({ type: '', message: '' });
        onClose();
    };

    if (!show) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0 modal-overlay"
            onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
            <div
                className="w-full max-w-md rounded-t-3xl sm:rounded-2xl p-6 animate-modal-slide-up"
                style={{
                    backgroundColor: 'var(--bg-card)',
                    boxShadow: 'var(--shadow-xl)',
                    border: '1px solid var(--border-color)',
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Şifremi Unuttum
                    </h3>
                    <button
                        onClick={handleClose}
                        className="p-2 rounded-xl transition-colors cursor-pointer border-0"
                        style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-secondary)' }}
                    >
                        <FiX size={18} />
                    </button>
                </div>

                <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                    Kayıtlı e-posta adresinizi girin, şifre sıfırlama bağlantısı göndereceğiz.
                </p>

                {/* Status Message */}
                {status.message && (
                    <div
                        className="flex items-start gap-2 p-3 rounded-xl mb-4 text-sm animate-slide-up"
                        style={{
                            backgroundColor: status.type === 'success' ? 'rgba(34,197,94,0.1)' : 'var(--color-primary-50)',
                            color: status.type === 'success' ? '#22c55e' : 'var(--color-primary)',
                            border: `1px solid ${status.type === 'success' ? 'rgba(34,197,94,0.2)' : 'var(--color-primary-100)'}`,
                        }}
                    >
                        {status.type === 'success' ? <FiCheckCircle className="mt-0.5 flex-shrink-0" size={16} /> : <FiAlertCircle className="mt-0.5 flex-shrink-0" size={16} />}
                        {status.message}
                    </div>
                )}

                <form onSubmit={handleReset}>
                    <div className="relative mb-4">
                        <FiMail
                            className="absolute left-3 top-1/2 -translate-y-1/2"
                            style={{ color: 'var(--text-tertiary)' }}
                            size={18}
                        />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="ornek@email.com"
                            required
                            className="w-full pl-10 pr-4 py-3 rounded-xl border outline-none text-sm transition-all duration-200"
                            style={{
                                backgroundColor: 'var(--bg-input)',
                                borderColor: 'var(--border-color)',
                                color: 'var(--text-primary)',
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="touch-target w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 cursor-pointer border-0 flex items-center justify-center gap-2"
                        style={{
                            backgroundColor: loading ? 'var(--text-tertiary)' : 'var(--color-primary)',
                            opacity: loading ? 0.7 : 1,
                        }}
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <FiSend size={16} />
                                Sıfırlama Bağlantısı Gönder
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

// ─── Login Page ───
export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [snackbar, setSnackbar] = useState({ show: false, type: '', message: '' });
    const { user, login, resetPassword, logout, resendVerification } = useAuth();
    const navigate = useNavigate();

    const handleCheckVerification = async () => {
        setLoading(true);
        setError('');
        try {
            if (user) {
                await user.reload();
                if (user.emailVerified) {
                    setSnackbar({
                        show: true,
                        type: 'success',
                        message: 'E-postanız başarıyla doğrulandı! Giriş yapılıyor... 🍽️',
                    });
                    setTimeout(() => {
                        navigate('/dashboard');
                    }, 1500);
                } else {
                    setError('E-postanız henüz doğrulanmamış. Lütfen e-postanızdaki doğrulama linkine tıklayın.');
                }
            }
        } catch (err) {
            console.error("Verification check error:", err);
            setError('Doğrulama durumu kontrol edilirken bir hata oluştu.');
        }
        setLoading(false);
    };

    const handleResendVerification = async () => {
        setLoading(true);
        setError('');
        try {
            await resendVerification();
            setSnackbar({
                show: true,
                type: 'success',
                message: 'Doğrulama e-postası başarıyla tekrar gönderildi! ✉️',
            });
        } catch (err) {
            console.error("Resend verification error:", err);
            setError('Doğrulama e-postası gönderilirken bir hata oluştu. Lütfen biraz bekleyin.');
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        setLoading(true);
        setError('');
        try {
            await logout();
            navigate('/login');
        } catch (err) {
            console.error("Logout error:", err);
        }
        setLoading(false);
    };

    const closeSnackbar = useCallback(() => {
        setSnackbar({ show: false, type: '', message: '' });
    }, []);

    const getErrorMessage = (code) => {
        const messages = {
            'auth/user-not-found': 'Bu e-posta ile kayıtlı bir hesap bulunamadı.',
            'auth/wrong-password': 'Şifre hatalı. Lütfen tekrar deneyin.',
            'auth/invalid-email': 'Geçersiz e-posta adresi.',
            'auth/too-many-requests': 'Çok fazla deneme yaptınız. Lütfen biraz bekleyin.',
            'auth/invalid-credential': 'E-posta veya şifre hatalı.',
        };
        return messages[code] || 'Giriş yapılırken bir hata oluştu.';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await login(email, password);
            if (!result.user.emailVerified) {
                setError('Lütfen e-postanızı onaylayın. Gelen kutunuzu (ve spam klasörünü) kontrol edin.');
                setLoading(false);
                return;
            }
            // Show success snackbar, then navigate
            setSnackbar({
                show: true,
                type: 'success',
                message: 'Başarıyla giriş yapıldı. Lezzet dünyasına hoş geldiniz! 🍽️',
            });
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);
        } catch (err) {
            const msg = getErrorMessage(err.code);
            setError(msg);
            setSnackbar({
                show: true,
                type: 'error',
                message: 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.',
            });
        }
        setLoading(false);
    };

    if (user && !user.emailVerified) {
        return (
            <>
                <div
                    className="min-h-screen flex items-center justify-center px-4 py-8"
                    style={{ backgroundColor: 'var(--bg-main)' }}
                >
                    <div className="w-full max-w-md animate-scale-in">
                        {/* Logo */}
                        <div className="text-center mb-8">
                            <div className="text-6xl mb-3 animate-float">✉️</div>
                            <h1
                                className="text-3xl font-bold mb-1"
                                style={{ color: 'var(--color-primary)' }}
                            >
                                E-posta Doğrulaması Gerekli
                            </h1>
                            <p style={{ color: 'var(--text-secondary)' }} className="text-sm">
                                E-posta adresinizi doğrulamanız gerekmektedir.
                            </p>
                        </div>

                        {/* Card */}
                        <div
                            className="rounded-2xl p-8 border relative overflow-hidden"
                            style={{
                                backgroundColor: 'var(--bg-card)',
                                borderColor: 'var(--border-color)',
                                boxShadow: 'var(--shadow-xl)',
                            }}
                        >
                            {loading && (
                                <div
                                    className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl animate-fade-in"
                                    style={{ backgroundColor: 'rgba(0,0,0,0.15)', backdropFilter: 'blur(2px)' }}
                                >
                                    <div
                                        className="w-10 h-10 border-3 rounded-full animate-spin"
                                        style={{ borderColor: 'var(--border-color)', borderTopColor: 'var(--color-primary)' }}
                                    />
                                </div>
                            )}

                            <div className="text-center mb-6">
                                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-primary)' }}>
                                    Lütfen <strong>{user.email}</strong> adresine gönderdiğimiz doğrulama linkine tıklayın.
                                </p>
                                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                    Eğer e-posta gelmediyse spam (gereksiz) klasörünü kontrol edebilir veya aşağıdaki butondan tekrar gönderebilirsiniz.
                                </p>
                            </div>

                            {error && (
                                <div
                                    className="flex items-start gap-2 p-3 rounded-xl mb-4 text-sm animate-slide-up"
                                    style={{
                                        backgroundColor: 'var(--color-primary-50)',
                                        color: 'var(--color-primary)',
                                        border: '1px solid var(--color-primary-100)',
                                    }}
                                >
                                    <FiAlertCircle className="mt-0.5 flex-shrink-0" size={16} />
                                    {error}
                                </div>
                            )}

                            <div className="space-y-3">
                                <button
                                    onClick={handleCheckVerification}
                                    className="touch-target w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 cursor-pointer border-0 flex items-center justify-center gap-2"
                                    style={{
                                        backgroundColor: 'var(--color-primary)',
                                    }}
                                >
                                    <FiCheckCircle size={18} />
                                    Doğrulamayı Kontrol Et
                                </button>

                                <button
                                    onClick={handleResendVerification}
                                    className="touch-target w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer border"
                                    style={{
                                        backgroundColor: 'var(--bg-input)',
                                        borderColor: 'var(--border-color)',
                                        color: 'var(--text-primary)',
                                    }}
                                >
                                    <FiSend size={18} />
                                    Yeniden Gönder
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="touch-target w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer border-0 flex items-center justify-center gap-2"
                                    style={{
                                        backgroundColor: 'var(--bg-chip)',
                                        color: 'var(--text-secondary)',
                                    }}
                                >
                                    <FiLogOut size={18} />
                                    Çıkış Yap
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Snackbar */}
                <Snackbar
                    show={snackbar.show}
                    type={snackbar.type}
                    message={snackbar.message}
                    onClose={closeSnackbar}
                />
            </>
        );
    }

    return (
        <>
            <div
                className="min-h-screen flex items-center justify-center px-4 py-8"
                style={{ backgroundColor: 'var(--bg-main)' }}
            >
                <div className="w-full max-w-md animate-scale-in">
                    {/* Logo */}
                    <div className="text-center mb-8 flex flex-col items-center">
                        <img
                            src="/android-chrome-192x192.png"
                            alt="Ne Yesem Logo"
                            className="w-20 h-20 mb-3 animate-float rounded-2xl object-contain"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'block';
                            }}
                        />
                        <span className="text-6xl mb-3 animate-float" style={{ display: 'none' }}>🍽️</span>
                        <h1
                            className="text-3xl font-bold mb-1"
                            style={{ color: 'var(--color-primary)' }}
                        >
                            Ne Yesem?
                        </h1>
                        <p style={{ color: 'var(--text-secondary)' }} className="text-sm">
                            Lezzetli tariflerin adresi
                        </p>
                    </div>

                    {/* Card */}
                    <div
                        className="rounded-2xl p-8 border relative overflow-hidden"
                        style={{
                            backgroundColor: 'var(--bg-card)',
                            borderColor: 'var(--border-color)',
                            boxShadow: 'var(--shadow-xl)',
                        }}
                    >
                        {/* Loading Overlay */}
                        {loading && (
                            <div
                                className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl animate-fade-in"
                                style={{ backgroundColor: 'rgba(0,0,0,0.15)', backdropFilter: 'blur(2px)' }}
                            >
                                <div
                                    className="w-10 h-10 border-3 rounded-full animate-spin"
                                    style={{ borderColor: 'var(--border-color)', borderTopColor: 'var(--color-primary)' }}
                                />
                            </div>
                        )}

                        <h2
                            className="text-xl font-semibold mb-6 text-center"
                            style={{ color: 'var(--text-primary)' }}
                        >
                            Giriş Yap
                        </h2>

                        {error && (
                            <div
                                className="flex items-start gap-2 p-3 rounded-xl mb-4 text-sm animate-slide-up"
                                style={{
                                    backgroundColor: 'var(--color-primary-50)',
                                    color: 'var(--color-primary)',
                                    border: '1px solid var(--color-primary-100)',
                                }}
                            >
                                <FiAlertCircle className="mt-0.5 flex-shrink-0" size={16} />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label
                                    className="block text-sm font-medium mb-1.5"
                                    style={{ color: 'var(--text-secondary)' }}
                                >
                                    E-posta
                                </label>
                                <div className="relative">
                                    <FiMail
                                        className="absolute left-3 top-1/2 -translate-y-1/2"
                                        style={{ color: 'var(--text-tertiary)' }}
                                        size={18}
                                    />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="ornek@email.com"
                                        required
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border outline-none text-sm transition-all duration-200"
                                        style={{
                                            backgroundColor: 'var(--bg-input)',
                                            borderColor: 'var(--border-color)',
                                            color: 'var(--text-primary)',
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                                        onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    className="block text-sm font-medium mb-1.5"
                                    style={{ color: 'var(--text-secondary)' }}
                                >
                                    Şifre
                                </label>
                                <div className="relative">
                                    <FiLock
                                        className="absolute left-3 top-1/2 -translate-y-1/2"
                                        style={{ color: 'var(--text-tertiary)' }}
                                        size={18}
                                    />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border outline-none text-sm transition-all duration-200"
                                        style={{
                                            backgroundColor: 'var(--bg-input)',
                                            borderColor: 'var(--border-color)',
                                            color: 'var(--text-primary)',
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                                        onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                                    />
                                </div>
                                {/* Şifremi Unuttum Link */}
                                <div className="flex justify-end mt-1.5">
                                    <button
                                        type="button"
                                        onClick={() => setShowForgotModal(true)}
                                        className="text-xs font-medium bg-transparent border-0 cursor-pointer transition-opacity hover:opacity-70"
                                        style={{ color: 'var(--color-primary)' }}
                                    >
                                        Şifremi Unuttum
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="touch-target w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 cursor-pointer border-0 flex items-center justify-center gap-2"
                                style={{
                                    backgroundColor: loading ? 'var(--text-tertiary)' : 'var(--color-primary)',
                                    opacity: loading ? 0.7 : 1,
                                }}
                              >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <FiLogIn size={18} />
                                        Giriş Yap
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                Hesabın yok mu?{' '}
                                <Link
                                    to="/register"
                                    className="font-semibold no-underline hover:underline"
                                    style={{ color: 'var(--color-primary)' }}
                                >
                                    Kayıt Ol
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Forgot Password Modal */}
            <ForgotPasswordModal
                show={showForgotModal}
                onClose={() => setShowForgotModal(false)}
                resetPassword={resetPassword}
            />

            {/* Snackbar */}
            <Snackbar
                show={snackbar.show}
                type={snackbar.type}
                message={snackbar.message}
                onClose={closeSnackbar}
            />
        </>
    );
}
