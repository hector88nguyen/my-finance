import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Wallet, PieChart, Grid, LogOut, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { logoutUser, getCurrentUser, getAccounts } from '../utils/localStorage';
import './Layout.css';

const Layout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = getCurrentUser();

    const [accounts, setAccounts] = useState([]);
    const [isAccOpen, setIsAccOpen] = useState(true);

    useEffect(() => {
        setAccounts(getAccounts());
    }, [location.pathname]);

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    return (
        <div className="layout">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <Wallet size={32} color="var(--primary-color)" />
                    <h2>Tài chính</h2>
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
                                        to="/transactions"
                                        state={{ filterAccountId: acc.id }}
                                        className="sub-nav-item"
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
                        <div className="avatar">{user?.name?.charAt(0).toUpperCase()}</div>
                        <span>{user?.name}</span>
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
                    <button onClick={handleLogout} className="logout-icon"><LogOut size={20} /></button>
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
