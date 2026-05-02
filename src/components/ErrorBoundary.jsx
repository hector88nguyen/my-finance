import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

const CHUNK_ERROR_PATTERNS = [
  'Failed to fetch dynamically imported module',
  'error loading dynamically imported module',
  'Importing a module script failed',
  'Loading chunk',
  'Loading CSS chunk',
];

function isChunkLoadError(error) {
  if (!error) return false;
  const msg = error.message || String(error);
  return CHUNK_ERROR_PATTERNS.some(p => msg.includes(p));
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, isChunkError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      isChunkError: isChunkLoadError(error),
      errorMessage: error?.message || String(error),
    };
  }

  componentDidCatch(error, errorInfo) {
    if (isChunkLoadError(error)) {
      window.location.reload();
      return;
    }
    // Log full details for debugging via Safari Web Inspector
    console.error('[ErrorBoundary] Error:', error);
    console.error('[ErrorBoundary] Component stack:', errorInfo?.componentStack);
  }

  handleReset() {
    this.setState({ hasError: false, isChunkError: false, errorMessage: '' });
  }

  render() {
    if (this.state.isChunkError) {
      return null; // reloading
    }

    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          height: '100vh', padding: '20px', textAlign: 'center',
          backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)'
        }}>
          <AlertTriangle size={64} style={{ color: 'var(--danger-color)', marginBottom: '16px' }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Đã xảy ra lỗi</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '8px', maxWidth: '400px' }}>
            Ứng dụng gặp sự cố không mong muốn. Vui lòng thử lại.
          </p>
          {this.state.errorMessage && (
            <p style={{
              fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '24px',
              maxWidth: '360px', wordBreak: 'break-all',
              background: 'var(--surface-color)', padding: '8px 12px',
              borderRadius: '8px', textAlign: 'left'
            }}>
              {this.state.errorMessage}
            </p>
          )}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => this.handleReset()}
              style={{
                padding: '10px 20px', backgroundColor: 'var(--surface-color)',
                color: 'var(--text-main)', border: '1px solid var(--border-color)',
                borderRadius: '8px', cursor: 'pointer', fontWeight: '500'
              }}
            >
              Thử lại
            </button>
            <button
              onClick={() => window.location.reload()}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
                backgroundColor: 'var(--primary-color)', color: 'white', border: 'none',
                borderRadius: '8px', cursor: 'pointer', fontWeight: '500'
              }}
            >
              <RefreshCcw size={18} />
              Tải lại trang
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
