import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, Eye, EyeOff, MoreVertical, Wallet, CreditCard, PiggyBank, Briefcase } from 'lucide-react';
import { getAccounts, addAccount, editAccount } from '../utils/localStorage';
import CurrencyInput from '../components/CurrencyInput';
import './Accounts.css';

export default function Accounts() {
    const [accounts, setAccounts] = useState([]);
    const [showBalance, setShowBalance] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingAcc, setEditingAcc] = useState(null);
    const navigate = useNavigate();

    // Add form state
    const [newAccName, setNewAccName] = useState('');
    const [newAccBalance, setNewAccBalance] = useState('');

    // Edit form state
    const [editAccName, setEditAccName] = useState('');
    const [editAccBalance, setEditAccBalance] = useState('');

    useEffect(() => {
        setAccounts(getAccounts());
    }, []);

    const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);

    const formatMoney = (amount) => {
        if (!showBalance) return '****** ₫';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const handleAddAccount = (e) => {
        e.preventDefault();
        if (!newAccName) return;
        const newAcc = addAccount({ name: newAccName, balance: newAccBalance, icon: 'Wallet' });
        setAccounts([...accounts, newAcc]);
        setShowAddModal(false);
        setNewAccName('');
        setNewAccBalance('');
    };

    const handleOpenEdit = (acc) => {
        setEditingAcc(acc);
        setEditAccName(acc.name);
        setEditAccBalance(acc.balance);
        setShowEditModal(true);
    };

    const handleEditAccount = (e) => {
        e.preventDefault();
        if (!editAccName || !editingAcc) return;
        const updated = editAccount(editingAcc.id, { name: editAccName, balance: editAccBalance });
        setAccounts(accounts.map(a => a.id === updated.id ? updated : a));
        setShowEditModal(false);
    };

    const getIcon = (iconName) => {
        switch (iconName) {
            case 'CreditCard': return <CreditCard size={24} />;
            case 'PiggyBank': return <PiggyBank size={24} />;
            case 'Briefcase': return <Briefcase size={24} />;
            default: return <Wallet size={24} />;
        }
    };

    return (
        <div className="accounts-page">
            <div className="accounts-header-banner">
                <h3>Tài khoản của tôi</h3>
                <div className="banner-content">
                    <div className="balance-section">
                        <p>Tổng số dư</p>
                        <div className="balance-amount-row">
                            <h2>{formatMoney(totalBalance)}</h2>
                            <button className="eye-btn" onClick={() => setShowBalance(!showBalance)}>
                                {showBalance ? <Eye size={20} /> : <EyeOff size={20} />}
                            </button>
                        </div>
                    </div>
                    <button className="add-acc-btn" onClick={() => setShowAddModal(true)}>
                        <Plus size={24} />
                    </button>
                </div>
            </div>

            <div className="accounts-list-section">
                <div className="section-title">
                    <h4>Tài khoản chi tiêu ({accounts.length})</h4>
                    <button className="arrow-btn">&gt;</button>
                </div>

                <div className="accounts-list card">
                    {accounts.map(acc => (
                        <div key={acc.id} className="acc-item">
                            <div
                                className="acc-info-left"
                                style={{ cursor: 'pointer', flex: 1 }}
                                onClick={() => navigate('/transactions', { state: { filterAccountId: acc.id } })}
                                title="Xem giao dịch của tài khoản này"
                            >
                                <div className="acc-icon-box">
                                    {getIcon(acc.icon)}
                                </div>
                                <div className="acc-details">
                                    <h5 style={{ color: 'var(--primary-color)' }}>{acc.name}</h5>
                                    <p>{formatMoney(acc.balance)}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    className="quick-add-btn"
                                    onClick={() => navigate('/transactions', { state: { openAdd: true, defaultAccountId: acc.id } })}
                                    title="Thêm giao dịch"
                                >
                                    <Plus size={20} />
                                </button>
                                <button className="more-btn" onClick={() => handleOpenEdit(acc)} title="Sửa thông tin">
                                    <MoreVertical size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content card">
                        <div className="modal-header">
                            <h2>Thêm tài khoản</h2>
                            <button className="btn-icon" onClick={() => setShowAddModal(false)}>×</button>
                        </div>
                        <form onSubmit={handleAddAccount}>
                            <div className="form-group">
                                <label>Tên tài khoản</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={newAccName}
                                    onChange={e => setNewAccName(e.target.value)}
                                    placeholder="Vd: ATM, Thẻ tín dụng..."
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Số dư ban đầu (VNĐ)</label>
                                <CurrencyInput
                                    className="input-field amount-input"
                                    value={newAccBalance}
                                    onChange={setNewAccBalance}
                                    placeholder="0"
                                />
                            </div>
                            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}>Lưu</button>
                        </form>
                    </div>
                </div>
            )}

            {showEditModal && (
                <div className="modal-overlay">
                    <div className="modal-content card">
                        <div className="modal-header">
                            <h2>Sửa tài khoản</h2>
                            <button className="btn-icon" onClick={() => setShowEditModal(false)}>×</button>
                        </div>
                        <form onSubmit={handleEditAccount}>
                            <div className="form-group">
                                <label>Tên tài khoản</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={editAccName}
                                    onChange={e => setEditAccName(e.target.value)}
                                    placeholder="Tên tài khoản"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Số dư hiện tại (VNĐ)</label>
                                <CurrencyInput
                                    className="input-field amount-input"
                                    value={editAccBalance}
                                    onChange={setEditAccBalance}
                                    placeholder="0"
                                />
                            </div>
                            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}>Cập nhật</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
