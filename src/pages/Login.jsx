import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, LogIn, UserPlus } from 'lucide-react';
import { loginUser, registerUser } from '../services/firebaseService';
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
                            className="input-field"
                            placeholder="Nhập mật khẩu (min 6 ký tự)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}>
                        {loading ? 'Đang xử lý...' : (isRegister ? 'Đăng ký' : 'Đăng nhập')}
                    </button>
                </form>

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
