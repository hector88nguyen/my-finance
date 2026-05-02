import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { LayoutDashboard, Wallet, PieChart, Grid, LogOut, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { signOutUser, getAccounts } from '../services/firebaseService';
import ThemeToggle from './ui/ThemeToggle';
import './Layout.css';

const Layout = ({ user, children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const currentAccountId = location.pathname === '/transactions' ? searchParams.get('account') : null;

    const [accounts, setAccounts] = useState([]);
    const [isAccOpen, setIsAccOpen] = useState(true);

    useEffect(() => {
        if (user) {
            const fetchAccounts = async () => {
                try {
                    const data = await getAccounts(user.uid);
                    setAccounts(data);
                } catch (err) {
                    console.error("Lỗi lấy danh sách ví:", err);
                }
            };
            fetchAccounts();
        }
    }, [user, location.pathname]);

    const handleLogout = async () => {
        await signOutUser();
        navigate('/login');
    };

    return (
        <div className="layout">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Wallet size={32} color="var(--primary-color)" />
                        <h2>Tài chính</h2>
                    </div>
                    <ThemeToggle />
                </div>

                <nav className="sidebar-nav">
                    <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
                        <LayoutDashboard size={20} /><span>Tổng quan</span>
                    </Link>

                    <div className="nav-item-group">
                        <Link to="/accounts" className={`nav-item ${location.pathname === '/accounts' ? 'active' : ''}`}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                                <Wallet size={20} /><span>Tài khoản của tôi</span>
                            </div>
                            <button
                                className="collapse-btn"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsAccOpen(!isAccOpen);
                                }}
                            >
                                {isAccOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </button>
                        </Link>

                        {isAccOpen && accounts.length > 0 && (
                            <div className="sub-nav-list">
                                {accounts.map(acc => (
                                    <Link
                                        key={acc.id}
                                        to={`/transactions?account=${acc.id}`}
                                        className={`sub-nav-item ${currentAccountId === acc.id ? 'active' : ''}`}
                                        title="Xem giao dịch tài khoản này"
                                    >
                                        <span className="dot">•</span>
                                        <span className="sub-nav-text">{acc.name}</span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    <Link to="/transactions" className={`nav-item ${location.pathname === '/transactions' ? 'active' : ''}`}>
                        <Plus size={20} /><span>Lịch sử / Giao dịch</span>
                    </Link>
                    <Link to="/reports" className={`nav-item ${location.pathname === '/reports' ? 'active' : ''}`}>
                        <PieChart size={20} /><span>Báo cáo</span>
                    </Link>
                    <Link to="/more" className={`nav-item ${location.pathname === '/more' ? 'active' : ''}`}>
                        <Grid size={20} /><span>Khác</span>
                    </Link>
                </nav>

                <div className="sidebar-footer">
                    <div className="user-info">
                        <div className="avatar">{user?.email?.charAt(0).toUpperCase()}</div>
                        <div className="user-details">
                            <span className="user-name">{user?.email?.split('@')[0]}</span>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="logout-btn">
                        <LogOut size={20} />
                        <span>Đăng xuất</span>
                    </button>
                </div>
            </aside>

            <main className="main-content">
                <header className="mobile-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Wallet size={24} color="var(--primary-color)" />
                        <h2>Tài chính</h2>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <ThemeToggle />
                        <button onClick={handleLogout} className="logout-icon" aria-label="Đăng xuất"><LogOut size={20} /></button>
                    </div>
                </header>
                <div className="content-wrapper">
                    {children}
                </div>
            </main>

            <nav className="mobile-bottom-nav">
                <Link to="/" className={`mobile-nav-item ${location.pathname === '/' ? 'active' : ''}`}>
                    <LayoutDashboard size={22} />
                    <span>Tổng quan</span>
                </Link>
                <Link to="/accounts" className={`mobile-nav-item ${location.pathname === '/accounts' ? 'active' : ''}`}>
                    <Wallet size={22} />
                    <span>Tài khoản</span>
                </Link>

                <div className="mobile-nav-fab-container">
                    <button
                        className="mobile-fab"
                        aria-label="Thêm giao dịch"
                        onClick={() => navigate('/transactions', { state: { openAdd: true } })}
                    >
                        <Plus size={28} />
                    </button>
                </div>

                <Link to="/reports" className={`mobile-nav-item ${location.pathname === '/reports' ? 'active' : ''}`}>
                    <PieChart size={22} />
                    <span>Báo cáo</span>
                </Link>
                <Link to="/more" className={`mobile-nav-item ${location.pathname === '/more' ? 'active' : ''}`}>
                    <Grid size={22} />
                    <span>Khác</span>
                </Link>
            </nav>
        </div>
    );
};

export default Layout;
