import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Suspense, lazy } from 'react';

import Navbar from './components/layout/Navbar';
import FloatingThemeToggle from './components/layout/FloatingThemeToggle';
import ErrorBoundary from './components/utils/ErrorBoundary';

// ─── Lazy-load all pages (code splitting) ───
// Login/Register load immediately (tiny, always needed)
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Dashboard and all other pages load only when navigated to
const Dashboard     = lazy(() => import('./pages/Dashboard'));
const ZarAt         = lazy(() => import('./pages/ZarAt'));
const NeVar         = lazy(() => import('./pages/NeVar'));
const Favorites     = lazy(() => import('./pages/Favorites'));
const TarifDefterim = lazy(() => import('./pages/TarifDefterim'));
const Profile       = lazy(() => import('./pages/Profile'));

// ─── Page loading spinner (shown during lazy load) ───
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-10 h-10 border-3 rounded-full animate-spin"
          style={{ borderColor: 'var(--border-color)', borderTopColor: 'var(--color-primary)' }}
        />
        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Yükleniyor...</span>
      </div>
    </div>
  );
}

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" />;
  if (!user.emailVerified) return <Navigate to="/login" state={{ error: 'Lütfen e-posta adresinizi doğrulayın.' }} />;

  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <PageLoader />;
  return user && user.emailVerified ? <Navigate to="/dashboard" /> : children;
}

function FadeTransition({ children }) {
  const location = useLocation();
  return (
    <div key={location.key} className="page-transition">
      {children}
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      {/* Floating dark/light toggle — only shown when logged in */}
      {user && user.emailVerified && <FloatingThemeToggle />}
      <Suspense fallback={<PageLoader />}>
        <FadeTransition>
          <Routes location={location}>
            <Route path="/login"          element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register"       element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/dashboard"      element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/zar-at"         element={<PrivateRoute><ZarAt /></PrivateRoute>} />
            <Route path="/ne-var"         element={<PrivateRoute><NeVar /></PrivateRoute>} />
            <Route path="/favoriler"      element={<PrivateRoute><Favorites /></PrivateRoute>} />
            <Route path="/tarif-defterim" element={<PrivateRoute><TarifDefterim /></PrivateRoute>} />
            <Route path="/profile"        element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="*"              element={<Navigate to="/login" />} />
          </Routes>
        </FadeTransition>
      </Suspense>
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
