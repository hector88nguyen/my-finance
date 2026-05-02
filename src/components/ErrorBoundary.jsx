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
    this.state = { hasError: false, isChunkError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, isChunkError: isChunkLoadError(error) };
  }

  componentDidCatch(error, errorInfo) {
    if (isChunkLoadError(error)) {
      // Auto-reload silently — new deployment made old chunks unavailable
      window.location.reload();
      return;
    }
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && !this.state.isChunkError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          height: '100vh', padding: '20px', textAlign: 'center', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)'
        }}>
          <AlertTriangle size={64} style={{ color: 'var(--danger-color)', marginBottom: '16px' }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Đã xảy ra lỗi</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', maxWidth: '400px' }}>
            Ứng dụng gặp sự cố không mong muốn. Vui lòng thử lại.
          </p>
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
      );
    }

    // Chunk error: show nothing while reload is in progress
    if (this.state.hasError && this.state.isChunkError) {
      return null;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
