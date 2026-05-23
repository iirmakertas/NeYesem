import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 text-center" style={{ backgroundColor: 'var(--bg-main)' }}>
          <div 
            className="max-w-sm rounded-2xl p-8 border animate-slide-up"
            style={{ 
                backgroundColor: 'var(--bg-card)', 
                borderColor: 'var(--border-color)',
                boxShadow: 'var(--shadow-xl)'
            }}
          >
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Bir şeyler ters gitti
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              Beklenmedik bir hata oluştu. Sayfayı yenilemek sorunu çözebilir.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white border-0 cursor-pointer transition-all duration-200"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              Sayfayı Yenile
            </button>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="w-full mt-3 py-2 rounded-xl text-xs font-medium border cursor-pointer transition-all duration-200"
              style={{ 
                  backgroundColor: 'transparent', 
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-secondary)'
              }}
            >
              Tekrar Dene
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
