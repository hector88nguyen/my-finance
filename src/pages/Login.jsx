import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, LogIn, UserPlus, Loader2 } from 'lucide-react';
import { loginUser, registerUser, loginWithGoogle } from '../services/firebaseService';
import './Login.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegister, setIsRegister] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isRegister) {
                await registerUser(email, password);
            } else {
                await loginUser(email, password);
            }
            navigate('/');
        } catch (err) {
            let msg = err.message;
            if (msg.includes('auth/invalid-email')) msg = 'Email không hợp lệ.';
            if (msg.includes('auth/user-not-found') || msg.includes('auth/wrong-password')) msg = 'Email hoặc mật khẩu không đúng.';
            if (msg.includes('auth/email-already-in-use')) msg = 'Email này đã được đăng ký.';
            if (msg.includes('auth/weak-password')) msg = 'Mật khẩu cần tối thiểu 6 ký tự.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        setLoading(true);
        try {
            await loginWithGoogle();
            navigate('/');
        } catch (err) {
            if (err.code === 'auth/popup-closed-by-user') {
                setError('Trình duyệt đã chặn hoặc bạn đã huỷ Popup đăng nhập của Google.');
            } else {
                setError('Đăng nhập bằng Google thất bại hoặc bị hủy.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <div className="logo-wrapper">
                        <Wallet size={40} color="white" />
                    </div>
                    <h1>{isRegister ? 'Tạo tài khoản mới' : 'Chào mừng quay lại'}</h1>
                    <p>{isRegister ? 'Bắt đầu quản lý tài chính ngay hôm nay' : 'Quản lý tài chính cá nhân hiệu quả'}</p>
                </div>

                {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            autoComplete="username"
                            spellCheck={false}
                            className="input-field"
                            placeholder="example@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Mật khẩu</label>
                        <input
                            type="password"
                            name="password"
                            autoComplete={isRegister ? 'new-password' : 'current-password'}
                            className="input-field"
                            placeholder="Nhập mật khẩu (min 6 ký tự)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}>
                        {loading ? <><Loader2 className="spinner" size={18} /> Đang xử lý...</> : (isRegister ? 'Đăng ký' : 'Đăng nhập')}
                    </button>
                </form>

                <div className="divider" style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', color: 'var(--text-secondary)' }}>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
                    <span style={{ padding: '0 1rem', fontSize: '0.9rem' }}>HOẶC</span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
                </div>

                <button 
                    type="button" 
                    className="btn-outline" 
                    onClick={handleGoogleLogin} 
                    disabled={loading}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1rem', background: 'white', color: '#333', border: '1px solid #ddd' }}
                >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: '20px', height: '20px' }} />
                    {loading ? 'Đang xử lý...' : 'Tiếp tục với Google'}
                </button>

                <div className="login-footer" style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <button 
                        className="btn-text" 
                        onClick={() => setIsRegister(!isRegister)}
                        style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 auto' }}
                    >
                        {isRegister ? <LogIn size={18} /> : <UserPlus size={18} />}
                        {isRegister ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký ngay'}
                    </button>
                </div>
            </div>
        </div>
    );
}
