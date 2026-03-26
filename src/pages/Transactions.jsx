import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Trash2, X, Filter, Loader2 } from 'lucide-react';
import { getTransactions, addTransaction, deleteTransaction, getAccounts, addAccount } from '../services/firebaseService';
import { CATEGORIES, getCategoryData } from '../utils/categories';
import CurrencyInput from '../components/CurrencyInput';
import './Transactions.css';

const VND = (amount) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const getDateLabel = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const isSameDay = (a, b) =>
        a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();

    if (isSameDay(date, today)) return `Hôm nay – ${date.toLocaleDateString('vi-VN')}`;
    if (isSameDay(date, yesterday)) return `Hôm qua – ${date.toLocaleDateString('vi-VN')}`;
    return date.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
};

export default function Transactions({ user }) {
    const [transactions, setTransactions] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    
    const [searchParams, setSearchParams] = useSearchParams();
    const filterAccountId = searchParams.get('account') || 'all';

    const handleSetFilterAccountId = (id) => {
        setSearchParams(prev => {
            if (id === 'all') prev.delete('account');
            else prev.set('account', id);
            return prev;
        });
    };

    // Inline create states
    const [showNewCategory, setShowNewCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [showNewAccount, setShowNewAccount] = useState(false);
    const [newAccountName, setNewAccountName] = useState('');
    const [newAccountBalance, setNewAccountBalance] = useState('');

    const [formData, setFormData] = useState({
        type: 'expense',
        amount: '',
        category: '',
        note: '',
        accountId: ''
    });

    // Custom categories added inline (UI only until added to a tx)
    const [customCategories, setCustomCategories] = useState([]);

    const location = useLocation();
    const navigate = useNavigate();

    const fetchData = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const [txs, accs] = await Promise.all([
                getTransactions(user.uid),
                getAccounts(user.uid)
            ]);
            setTransactions(txs);
            setAccounts(accs);

            // Handle location state for opening modal
            if (location.state?.openAdd) {
                const defaultId = location.state.defaultAccountId || (accs.length > 0 ? accs[0].id : '');
                setFormData(prev => ({ ...prev, accountId: defaultId }));
                setShowModal(true);
                navigate('.', { replace: true, state: {} });
            } else if (accs.length > 0 && !formData.accountId) {
                setFormData(prev => ({ ...prev, accountId: accs[0].id }));
            }
        } catch (err) {
            console.error("Lỗi lấy dữ liệu:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!formData.amount || !formData.category || !formData.accountId || !user) {
            alert("Vui lòng nhập đủ các trường yêu cầu.");
            return;
        }
        setSubmitting(true);
        try {
            await addTransaction(user.uid, formData);
            await fetchData(); // Refresh both txs and accounts (for balance)
            setShowModal(false);
            setFormData({
                type: 'expense', amount: '', category: '', note: '',
                accountId: accounts.length > 0 ? accounts[0].id : ''
            });
            setCustomCategories([]);
            setShowNewCategory(false);
            setShowNewAccount(false);
        } catch (err) {
            alert("Lỗi thêm giao dịch: " + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Bạn có chắc chắn muốn xóa giao dịch này?')) {
            setLoading(true);
            try {
                await deleteTransaction(user.uid, id);
                await fetchData();
            } catch (err) {
                alert("Lỗi xóa giao dịch: " + err.message);
                setLoading(false);
            }
        }
    };

    const handleAddNewCategory = () => {
        const name = newCategoryName.trim();
        if (!name) return;
        setCustomCategories(prev => [...prev, { id: 'custom_' + Date.now(), name }]);
        setFormData(f => ({ ...f, category: name }));
        setNewCategoryName('');
        setShowNewCategory(false);
    };

    const handleAddNewAccount = async () => {
        const name = newAccountName.trim();
        if (!name || !user) return;
        setSubmitting(true);
        try {
            const newAcc = await addAccount(user.uid, { name, balance: newAccountBalance, icon: 'Wallet' });
            setAccounts(prev => [...prev, newAcc]);
            setFormData(f => ({ ...f, accountId: newAcc.id }));
            setNewAccountName('');
            setNewAccountBalance('');
            setShowNewAccount(false);
        } catch (err) {
            alert("Lỗi tạo tài khoản: " + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    // Group transactions by date
    const displayedTransactions = filterAccountId === 'all'
        ? transactions
        : transactions.filter(t => t.accountId === filterAccountId);

    const groupedByDate = useMemo(() => {
        const groups = {};
        displayedTransactions.forEach(tx => {
            const key = new Date(tx.createdAt).toDateString();
            if (!groups[key]) groups[key] = { label: getDateLabel(tx.createdAt), txs: [] };
            groups[key].txs.push(tx);
        });
        return Object.values(groups);
    }, [displayedTransactions]);

    const allCategories = [...CATEGORIES[formData.type], ...customCategories];

    if (loading && transactions.length === 0) {
        return (
            <div className="empty-state" style={{ height: '60vh' }}>
                <Loader2 className="animate-spin" size={48} color="var(--primary-color)" />
                <p>Đang tải giao dịch...</p>
            </div>
        );
    }

    return (
        <div className="transactions-page">
            <div className="page-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <h1 className="page-title" style={{ marginBottom: 0 }}>Lịch sử giao dịch</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--surface-color)', padding: '0.25rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <Filter size={16} color="var(--text-muted)" />
                        <select
                            style={{ border: 'none', outline: 'none', background: 'transparent', fontWeight: 600, color: 'var(--primary-color)', fontSize: '0.95rem' }}
                            value={filterAccountId}
                            onChange={(e) => handleSetFilterAccountId(e.target.value)}
                        >
                            <option value="all">Tất cả tài khoản</option>
                            {accounts.map(acc => (
                                <option key={acc.id} value={acc.id}>{acc.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <button className="btn-primary" onClick={() => {
                    const defaultId = filterAccountId !== 'all' ? filterAccountId : (accounts.length > 0 ? accounts[0].id : '');
                    setFormData(prev => ({ ...prev, accountId: defaultId }));
                    setShowModal(true);
                }}>
                    <Plus size={20} />
                    Thêm mới
                </button>
            </div>

            {displayedTransactions.length === 0 ? (
                <div className="card">
                    <div className="empty-state"><p>Chưa có giao dịch nào phù hợp.</p></div>
                </div>
            ) : (
                groupedByDate.map(group => (
                    <div key={group.label} className="tx-date-group">
                        <div className="tx-date-header">{group.label}</div>
                        <div className="card tx-list-container">
                            {group.txs.map(tx => {
                                const accName = accounts.find(a => a.id === tx.accountId)?.name || 'Tài khoản ẩn';
                                const catData = getCategoryData(tx.category, tx.type);
                                const IconComponent = catData.icon;
                                return (
                                    <div key={tx.id} className="tx-list-item">
                                        <div className="tx-info">
                                            <div className="tx-icon" style={{ backgroundColor: `${catData.color}20`, color: catData.color }}>
                                                <IconComponent size={20} />
                                            </div>
                                            <div>
                                                <h4>{tx.category}</h4>
                                                <p>{accName}{tx.note && ` • ${tx.note}`}</p>
                                            </div>
                                        </div>
                                        <div className="tx-actions">
                                            <span className={`tx-amount ${tx.type}`}>
                                                {tx.type === 'income' ? '+' : '-'}{VND(tx.amount)}
                                            </span>
                                            <button className="btn-icon delete-btn" onClick={() => handleDelete(tx.id)} title="Xóa giao dịch" aria-label="Xóa giao dịch">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))
            )}

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content card">
                        <div className="modal-header">
                            <h2>Thêm giao dịch mới</h2>
                            <button className="btn-icon" onClick={() => setShowModal(false)} aria-label="Đóng"><X size={24} /></button>
                        </div>

                        <form onSubmit={handleAdd}>
                            <div className="type-toggle">
                                <button type="button" className={`toggle-btn ${formData.type === 'expense' ? 'expense-active' : ''}`}
                                    onClick={() => setFormData({ ...formData, type: 'expense', category: '' })}>Khoản Chi</button>
                                <button type="button" className={`toggle-btn ${formData.type === 'income' ? 'income-active' : ''}`}
                                    onClick={() => setFormData({ ...formData, type: 'income', category: '' })}>Khoản Thu</button>
                            </div>

                            <div className="form-group">
                                <label>Số tiền (VNĐ)</label>
                                <CurrencyInput className="input-field amount-input" placeholder="0"
                                    value={formData.amount} onChange={(val) => setFormData({ ...formData, amount: val })} required />
                            </div>

                            <div className="form-group">
                                <label>Danh mục</label>
                                <select className="input-field" value={formData.category}
                                    onChange={(e) => {
                                        if (e.target.value === '__new__') { setShowNewCategory(true); }
                                        else { setFormData({ ...formData, category: e.target.value }); }
                                    }} required>
                                    <option value="">-- Chọn danh mục --</option>
                                    {allCategories.map(cat => (
                                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                                    ))}
                                    <option value="__new__">+ Tạo danh mục mới...</option>
                                </select>
                                {showNewCategory && (
                                    <div className="inline-create-box">
                                        <input className="input-field" placeholder="Tên danh mục mới"
                                            value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} autoFocus />
                                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                            <button type="button" className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '0.5rem' }} onClick={handleAddNewCategory}>Thêm</button>
                                            <button type="button" className="btn-secondary" style={{ flex: 1, padding: '0.5rem' }} onClick={() => setShowNewCategory(false)}>Huỷ</button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Vào tài khoản</label>
                                <select className="input-field" value={formData.accountId}
                                    onChange={e => {
                                        if (e.target.value === '__new__') { setShowNewAccount(true); }
                                        else { setFormData({ ...formData, accountId: e.target.value }); }
                                    }} required style={{ fontWeight: 600, color: 'var(--primary-color)' }}>
                                    <option value="">-- Chọn tài khoản --</option>
                                    {accounts.map(acc => (
                                        <option key={acc.id} value={acc.id}>{acc.name} ({VND(acc.balance)})</option>
                                    ))}
                                    <option value="__new__">+ Tạo tài khoản mới...</option>
                                </select>
                                {showNewAccount && (
                                    <div className="inline-create-box">
                                        <input className="input-field" placeholder="Tên tài khoản"
                                            value={newAccountName} onChange={e => setNewAccountName(e.target.value)} autoFocus />
                                        <CurrencyInput className="input-field" placeholder="Số dư ban đầu (VNĐ)"
                                            value={newAccountBalance} onChange={setNewAccountBalance} />
                                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                            <button type="button" className="btn-primary" disabled={submitting} style={{ flex: 1, justifyContent: 'center', padding: '0.5rem' }} onClick={handleAddNewAccount}>
                                                {submitting ? '...' : 'Tạo'}
                                            </button>
                                            <button type="button" className="btn-secondary" style={{ flex: 1, padding: '0.5rem' }} onClick={() => setShowNewAccount(false)}>Huỷ</button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Ghi chú (Tùy chọn)</label>
                                <input type="text" className="input-field" placeholder="Chi tiết giao dịch"
                                    value={formData.note} onChange={(e) => setFormData({ ...formData, note: e.target.value })} />
                            </div>

                            <button type="submit" className="btn-primary" disabled={submitting} style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}>
                                {submitting ? 'Đang lưu...' : 'Lưu giao dịch'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
