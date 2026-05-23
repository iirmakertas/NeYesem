import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMail, FiLock, FiUserPlus, FiAlertCircle, FiCheckCircle, FiUser } from 'react-icons/fi';

export default function Register() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [usernameStatus, setUsernameStatus] = useState({ checking: false, available: null, message: '' });
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const { signUp, checkUsernameAvailable } = useAuth();

    // Debounced username availability check
    useEffect(() => {
        if (!username || username.length < 3) {
            setUsernameStatus({ checking: false, available: null, message: '' });
            return;
        }

        // Validate username format
        const usernameRegex = /^[a-zA-Z0-9_çğıöşüÇĞİÖŞÜ]+$/;
        if (!usernameRegex.test(username)) {
            setUsernameStatus({
                checking: false,
                available: false,
                message: 'Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir.'
            });
            return;
        }

        setUsernameStatus({ checking: true, available: null, message: 'Kullanıcı adı kontrol ediliyor...' });

        const timer = setTimeout(async () => {
            try {
                const isAvailable = await checkUsernameAvailable(username);
                setUsernameStatus({
                    checking: false,
                    available: isAvailable,
                    message: isAvailable 
                        ? 'Bu kullanıcı adı müsait! ✓'
                        : 'Bu kullanıcı adı zaten alınmış.'
                });
            } catch (err) {
                console.error("Kullanıcı adı kontrol hatası:", err);
                setUsernameStatus({ checking: false, available: null, message: 'Kullanıcı adı kontrolü başarısız oldu.' });
            }
        }, 600);

        return () => clearTimeout(timer);
    }, [username, checkUsernameAvailable]);

    const getErrorMessage = (code) => {
        const messages = {
            'auth/email-already-in-use': 'Bu e-posta zaten kullanılıyor.',
            'auth/invalid-email': 'Geçersiz e-posta adresi.',
            'auth/weak-password': 'Şifre en az 6 karakter olmalıdır.',
            'auth/username-taken': 'Bu kullanıcı adı zaten kullanılıyor.',
        };
        return messages[code] || 'Kayıt olurken bir hata oluştu.';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!username || username.length < 3) {
            setError('Kullanıcı adı en az 3 karakter olmalıdır.');
            return;
        }

        if (usernameStatus.available === false) {
            setError('Bu kullanıcı adı zaten alınmış. Lütfen başka bir tane seçin.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Şifreler uyuşmuyor.');
            return;
        }

        if (password.length < 6) {
            setError('Şifre en az 6 karakter olmalıdır.');
            return;
        }

        setLoading(true);
        try {
            await signUp(email, password, username);
            setSuccess(true);
        } catch (err) {
            console.error("Kayıt olma hatası:", err);
            setError(getErrorMessage(err.code));
        }
        setLoading(false);
    };

    if (success) {
        return (
            <div
                className="min-h-screen flex items-center justify-center px-4 py-8"
                style={{ backgroundColor: 'var(--bg-main)' }}
            >
                <div className="w-full max-w-md animate-scale-in text-center">
                    <div className="text-6xl mb-4">📧</div>
                    <div
                        className="rounded-2xl p-8 border"
                        style={{
                            backgroundColor: 'var(--bg-card)',
                            borderColor: 'var(--border-color)',
                            boxShadow: 'var(--shadow-xl)',
                        }}
                    >
                        <div
                            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                            style={{ backgroundColor: '#dcfce7' }}
                        >
                            <FiCheckCircle size={32} style={{ color: 'var(--color-success)' }} />
                        </div>
                        <h2
                            className="text-xl font-bold mb-2"
                            style={{ color: 'var(--text-primary)' }}
                        >
                            Kayıt Başarılı! 🎉
                        </h2>
                        <p
                            className="text-sm mb-6"
                            style={{ color: 'var(--text-secondary)' }}
                        >
                            <><strong>{email}</strong> adresine bir doğrulama e-postası gönderdik. Lütfen gelen kutunuzu (ve spam klasörünü) kontrol edin ve hesabınızı doğrulayın.</>
                        </p>
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white no-underline transition-all duration-200"
                            style={{ backgroundColor: 'var(--color-primary)' }}
                        >
                            Giriş Sayfasına Dön
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 py-8"
            style={{ backgroundColor: 'var(--bg-main)' }}
        >
            <div className="w-full max-w-md animate-scale-in">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="text-6xl mb-3 animate-float">🍽️</div>
                    <h1
                        className="text-3xl font-bold mb-1"
                        style={{ color: 'var(--color-primary)' }}
                    >
                        Ne Yesem?
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }} className="text-sm">
                        Hemen kayıt ol, tarifleri keşfet!
                    </p>
                </div>

                {/* Card */}
                <div
                    className="rounded-2xl p-8 border"
                    style={{
                        backgroundColor: 'var(--bg-card)',
                        borderColor: 'var(--border-color)',
                        boxShadow: 'var(--shadow-xl)',
                    }}
                >
                    <h2
                        className="text-xl font-semibold mb-6 text-center"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        Kayıt Ol
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
                        {/* Username Field */}
                        <div>
                            <label
                                className="block text-sm font-medium mb-1.5"
                                style={{ color: 'var(--text-secondary)' }}
                            >
                                Kullanıcı Adı
                            </label>
                            <div className="relative">
                                <FiUser
                                    className="absolute left-3 top-1/2 -translate-y-1/2"
                                    style={{ color: 'var(--text-tertiary)' }}
                                    size={18}
                                />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="sefAhmet"
                                    required
                                    minLength={3}
                                    maxLength={20}
                                    className="w-full pl-10 pr-10 py-3 rounded-xl border outline-none text-sm transition-all duration-200"
                                    style={{
                                        backgroundColor: 'var(--bg-input)',
                                        borderColor: usernameStatus.available === true ? '#22c55e'
                                            : usernameStatus.available === false ? 'var(--color-primary)'
                                                : 'var(--border-color)',
                                        color: 'var(--text-primary)',
                                    }}
                                    onFocus={(e) => {
                                        if (usernameStatus.available === null) {
                                            e.target.style.borderColor = 'var(--color-primary)';
                                        }
                                    }}
                                    onBlur={(e) => {
                                        if (usernameStatus.available === null) {
                                            e.target.style.borderColor = 'var(--border-color)';
                                        }
                                    }}
                                />
                                {/* Status icon */}
                                {username.length >= 3 && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        {usernameStatus.checking ? (
                                            <div
                                                className="w-4 h-4 border-2 rounded-full animate-spin"
                                                style={{
                                                    borderColor: 'var(--border-color)',
                                                    borderTopColor: 'var(--color-primary)'
                                                }}
                                            />
                                        ) : usernameStatus.available === true ? (
                                            <FiCheckCircle size={16} style={{ color: '#22c55e' }} />
                                        ) : usernameStatus.available === false ? (
                                            <FiAlertCircle size={16} style={{ color: 'var(--color-primary)' }} />
                                        ) : null}
                                    </div>
                                )}
                            </div>
                            {/* Username status message */}
                            {usernameStatus.message && (
                                <p
                                    className="text-xs mt-1 animate-fade-in"
                                    style={{
                                        color: usernameStatus.available === true ? '#22c55e'
                                            : usernameStatus.available === false ? 'var(--color-primary)'
                                                : 'var(--text-tertiary)'
                                    }}
                                >
                                    {usernameStatus.message}
                                </p>
                            )}
                        </div>

                        {/* Email Field */}
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

                        {/* Password Field */}
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
                                    placeholder="En az 6 karakter"
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
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label
                                className="block text-sm font-medium mb-1.5"
                                style={{ color: 'var(--text-secondary)' }}
                            >
                                Şifre Tekrar
                            </label>
                            <div className="relative">
                                <FiLock
                                    className="absolute left-3 top-1/2 -translate-y-1/2"
                                    style={{ color: 'var(--text-tertiary)' }}
                                    size={18}
                                />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Şifrenizi tekrar girin"
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
                        </div>

                        <button
                            type="submit"
                            disabled={loading || usernameStatus.checking || usernameStatus.available === false}
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
                                    <FiUserPlus size={18} />
                                    Kayıt Ol
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            Zaten hesabınız var mı?{' '}
                            <Link
                                to="/login"
                                className="font-semibold no-underline hover:underline"
                                style={{ color: 'var(--color-primary)' }}
                            >
                                Giriş Yap
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
