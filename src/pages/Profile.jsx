import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { doc, updateDoc } from 'firebase/firestore';
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';
import { FiArrowLeft, FiCheck, FiUser, FiLogOut } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const animalIcons = [
    { id: 'panda', emoji: '🐼', name: 'Panda' },
    { id: 'chick', emoji: '🐤', name: 'Civciv' },
    { id: 'cat', emoji: '🐱', name: 'Kedi' },
    { id: 'dog', emoji: '🐶', name: 'Köpek' },
    { id: 'fox', emoji: '🦊', name: 'Tilki' },
    { id: 'lion', emoji: '🦁', name: 'Aslan' },
    { id: 'frog', emoji: '🐸', name: 'Kurbağa' },
    { id: 'rabbit', emoji: '🐰', name: 'Tavşan' },
    { id: 'tiger', emoji: '🐯', name: 'Kaplan' },
    { id: 'koala', emoji: '🐨', name: 'Koala' },
];

export default function Profile() {
    const { user, userData, setUserData } = useAuth();
    const [selectedIcon, setSelectedIcon] = useState(userData?.photoURL || '');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    // Change Password States
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordUpdating, setPasswordUpdating] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState(false);

    const { logout } = useAuth();
    const handleLogout = async () => {
        if (window.confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
            try {
                await logout();
            } catch (error) {
                console.error('Logout error:', error);
            }
        }
    };

    useEffect(() => {
        if (userData?.photoURL) {
            setSelectedIcon(userData.photoURL);
        }
    }, [userData]);

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);
        setMessage('');

        try {
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
                photoURL: selectedIcon
            });

            // Update local context
            setUserData(prev => ({ ...prev, photoURL: selectedIcon }));
            setMessage('Profil resmi başarıyla güncellendi!');
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage('Bir hata oluştu.');
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (!user) return;

        if (newPassword.length < 6) {
            setPasswordMessage('Şifre en az 6 karakter olmalıdır.');
            setPasswordSuccess(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordMessage('Şifreler uyuşmuyor.');
            setPasswordSuccess(false);
            return;
        }

        setPasswordUpdating(true);
        setPasswordMessage('');

        try {
            // Reauthenticate first to satisfy security constraints
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);

            // Update password
            await updatePassword(user, newPassword);

            // Success feedback
            setPasswordSuccess(true);
            setPasswordMessage('Şifreniz başarıyla güncellendi!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error("Error updating password:", error);
            if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
                setPasswordMessage('Mevcut şifreniz yanlış.');
            } else {
                setPasswordMessage(error.message || 'Bir hata oluştu.');
            }
            setPasswordSuccess(false);
        } finally {
            setPasswordUpdating(false);
        }
    };

    return (
        <div className="min-h-screen px-4 pt-6 pb-28 md:py-10" style={{ backgroundColor: 'var(--bg-main)' }}>
            <div className="max-w-md mx-auto">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8 animate-fade-in">
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
                            👤 Profil Ayarları
                        </h1>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                            Kişisel profilini özelleştir.
                        </p>
                    </div>
                </div>

                {/* Profile Card */}
                <div
                    className="p-6 rounded-2xl border animate-slide-up bg-card"
                    style={{
                        backgroundColor: 'var(--bg-card)',
                        borderColor: 'var(--border-color)',
                        boxShadow: 'var(--shadow-md)',
                    }}
                >
                    <div className="flex flex-col items-center mb-8">
                        <div
                            className="w-24 h-24 rounded-full flex items-center justify-center text-5xl mb-4 border-4"
                            style={{
                                backgroundColor: 'var(--bg-chip)',
                                borderColor: 'var(--color-primary-light)',
                            }}
                        >
                            {selectedIcon || <FiUser size={40} style={{ color: 'var(--text-tertiary)' }} />}
                        </div>
                        <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                            {userData?.username || user?.email?.split('@')[0]}
                        </h2>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            {user?.email}
                        </p>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                            Bir İkon Seçin
                        </label>
                        <div className="grid grid-cols-5 gap-3">
                            {animalIcons.map((icon) => (
                                <button
                                    key={icon.id}
                                    onClick={() => setSelectedIcon(icon.emoji)}
                                    className="aspect-square flex items-center justify-center text-3xl rounded-xl border-2 transition-all duration-200 cursor-pointer p-0"
                                    style={{
                                        backgroundColor: selectedIcon === icon.emoji ? 'var(--bg-chip)' : 'var(--bg-input)',
                                        borderColor: selectedIcon === icon.emoji ? 'var(--color-primary)' : 'transparent',
                                    }}
                                    title={icon.name}
                                >
                                    {icon.emoji}
                                </button>
                            ))}
                        </div>
                    </div>

                    {message && (
                        <div
                            className="mb-4 p-3 rounded-xl text-sm text-center animate-fade-in"
                            style={{
                                backgroundColor: message === 'Profil resmi başarıyla güncellendi!' ? '#dcfce7' : '#fee2e2',
                                color: message === 'Profil resmi başarıyla güncellendi!' ? '#166534' : '#b91c1c',
                            }}
                        >
                            {message}
                        </div>
                    )}

                    <button
                        onClick={handleSave}
                        disabled={saving || (selectedIcon === userData?.photoURL)}
                        className="w-full py-3.5 rounded-xl text-sm font-bold text-white border-0 cursor-pointer transition-all duration-200 flex items-center justify-center gap-2"
                        style={{
                            backgroundColor: saving ? 'var(--text-tertiary)' : 'var(--color-primary)',
                            opacity: (saving || selectedIcon === userData?.photoURL) ? 0.7 : 1,
                        }}
                    >
                        {saving ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <FiCheck size={18} />
                                Değişiklikleri Kaydet
                            </>
                        )}
                    </button>
                </div>

                {/* Change Password Card */}
                <div
                    className="p-6 rounded-2xl border animate-slide-up mt-6 bg-card"
                    style={{
                        backgroundColor: 'var(--bg-card)',
                        borderColor: 'var(--border-color)',
                        boxShadow: 'var(--shadow-md)',
                        animationDelay: '120ms',
                        animationFillMode: 'both',
                    }}
                >
                    <h3 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                        🔑 Şifre Değiştir
                    </h3>

                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                                Mevcut Şifre
                            </label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="•••••"
                                required
                                className="w-full px-4 py-2.5 rounded-xl border outline-none text-sm transition-all duration-200"
                                style={{
                                    backgroundColor: 'var(--bg-input)',
                                    borderColor: 'var(--border-color)',
                                    color: 'var(--text-primary)',
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                                Yeni Şifre
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="•••••"
                                required
                                className="w-full px-4 py-2.5 rounded-xl border outline-none text-sm transition-all duration-200"
                                style={{
                                    backgroundColor: 'var(--bg-input)',
                                    borderColor: 'var(--border-color)',
                                    color: 'var(--text-primary)',
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                                Yeni Şifre (Tekrar)
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="•••••"
                                required
                                className="w-full px-4 py-2.5 rounded-xl border outline-none text-sm transition-all duration-200"
                                style={{
                                    backgroundColor: 'var(--bg-input)',
                                    borderColor: 'var(--border-color)',
                                    color: 'var(--text-primary)',
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                            />
                        </div>

                        {passwordMessage && (
                            <div
                                className="p-3 rounded-xl text-xs text-center animate-fade-in"
                                style={{
                                    backgroundColor: passwordSuccess ? '#dcfce7' : '#fee2e2',
                                    color: passwordSuccess ? '#166534' : '#b91c1c',
                                }}
                            >
                                {passwordMessage}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={passwordUpdating || !currentPassword || !newPassword || !confirmPassword}
                            className="w-full py-3.5 rounded-xl text-sm font-bold text-white border-0 cursor-pointer transition-all duration-200 flex items-center justify-center gap-2"
                            style={{
                                backgroundColor: passwordUpdating ? 'var(--text-tertiary)' : 'var(--color-primary)',
                                opacity: (passwordUpdating || !currentPassword || !newPassword || !confirmPassword) ? 0.7 : 1,
                            }}
                        >
                            {passwordUpdating ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <FiCheck size={18} />
                                    Şifre Değiştir
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="w-full mt-6 py-4 rounded-2xl text-sm font-bold text-white border-0 cursor-pointer transition-all duration-200 flex items-center justify-center gap-2"
                    style={{
                        backgroundColor: '#dc2626',
                        boxShadow: '0 6px 20px rgba(220, 38, 38, 0.2)',
                    }}
                >
                    <FiLogOut size={18} />
                    Çıkış Yap
                </button>
            </div>
        </div>
    );
}
