import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Cập nhật state để render fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Có thể log error info lên server tại đây
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI tùy chỉnh
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          height: '100vh', padding: '20px', textAlign: 'center', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)'
        }}>
          <AlertTriangle size={64} style={{ color: 'var(--danger-color)', marginBottom: '16px' }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Đã xảy ra lỗi gián đoạn</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', maxWidth: '400px' }}>
            Không thể tải được thành phần trang web. Điều này thường do gián đoạn kết nối mạng khi tải mã nguồn bổ sung.
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

    return this.props.children;
  }
}

export default ErrorBoundary;
