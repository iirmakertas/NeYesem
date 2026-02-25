import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMail, FiLock, FiLogIn, FiAlertCircle } from 'react-icons/fi';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

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
            navigate('/dashboard');
        } catch (err) {
            setError(getErrorMessage(err.code));
        }
        setLoading(false);
    };

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
                        Lezzetli tariflerin adresi
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
                            Hesabınız yok mu?{' '}
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
    );
}
