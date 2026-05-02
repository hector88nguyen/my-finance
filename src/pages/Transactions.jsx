import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Trash2, X, Filter, Loader2, Edit2, ArrowLeftRight } from 'lucide-react';
import { getTransactions, addTransaction, editTransaction, addTransfer, deleteTransaction, getAccounts, addAccount } from '../services/firebaseService';
import { CATEGORIES, getCategoryData } from '../utils/categories';
import CurrencyInput from '../components/CurrencyInput';
import { useToast } from '../contexts/ToastContext';
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
    const { addToast } = useToast();
    const [transactions, setTransactions] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingTx, setEditingTx] = useState(null);

    // Filter states
    const [showFilter, setShowFilter] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [filterFromDate, setFilterFromDate] = useState('');
    const [filterToDate, setFilterToDate] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    
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

    // Transfer form state
    const [transferData, setTransferData] = useState({ fromAccountId: '', toAccountId: '', amount: '', note: '' });

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
            addToast("Vui lòng nhập đủ các trường yêu cầu.", 'error');
            return;
        }
        setSubmitting(true);
        try {
            await addTransaction(user.uid, formData);
            await fetchData();
            setShowModal(false);
            setFormData({
                type: 'expense', amount: '', category: '', note: '',
                accountId: accounts.length > 0 ? accounts[0].id : ''
            });
            setCustomCategories([]);
            setShowNewCategory(false);
            setShowNewAccount(false);
            addToast("Đã lưu giao dịch thành công.", 'success');
        } catch (err) {
            addToast("Lỗi thêm giao dịch: " + err.message, 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (tx) => {
        setEditingTx(tx);
        setFormData({
            type: tx.type,
            amount: tx.amount,
            category: tx.category,
            note: tx.note || '',
            accountId: tx.accountId
        });
        setCustomCategories([]);
        setShowNewCategory(false);
        setShowNewAccount(false);
        setShowModal(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!formData.amount || !formData.category || !formData.accountId || !user || !editingTx) {
            addToast("Vui lòng nhập đủ các trường yêu cầu.", 'error');
            return;
        }
        setSubmitting(true);
        try {
            await editTransaction(user.uid, editingTx.id, formData);
            await fetchData();
            setShowModal(false);
            setEditingTx(null);
            setFormData({ type: 'expense', amount: '', category: '', note: '', accountId: accounts.length > 0 ? accounts[0].id : '' });
            addToast("Đã cập nhật giao dịch.", 'success');
        } catch (err) {
            addToast("Lỗi cập nhật: " + err.message, 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingTx(null);
        setFormData({ type: 'expense', amount: '', category: '', note: '', accountId: accounts.length > 0 ? accounts[0].id : '' });
        setTransferData({ fromAccountId: '', toAccountId: '', amount: '', note: '' });
        setCustomCategories([]);
        setShowNewCategory(false);
        setShowNewAccount(false);
    };

    const handleTransfer = async (e) => {
        e.preventDefault();
        if (!transferData.fromAccountId || !transferData.toAccountId || !transferData.amount) {
            addToast("Vui lòng nhập đủ các trường yêu cầu.", 'error');
            return;
        }
        if (transferData.fromAccountId === transferData.toAccountId) {
            addToast("Tài khoản nguồn và đích không được trùng nhau.", 'error');
            return;
        }
        setSubmitting(true);
        try {
            await addTransfer(user.uid, transferData);
            await fetchData();
            setShowModal(false);
            setTransferData({ fromAccountId: '', toAccountId: '', amount: '', note: '' });
            addToast("Chuyển tiền thành công.", 'success');
        } catch (err) {
            addToast("Lỗi chuyển tiền: " + err.message, 'error');
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
                addToast("Đã xóa giao dịch.", 'success');
            } catch (err) {
                addToast("Lỗi xóa giao dịch: " + err.message, 'error');
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
            addToast(`Đã tạo tài khoản "${name}".`, 'success');
        } catch (err) {
            addToast("Lỗi tạo tài khoản: " + err.message, 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const groupedByDate = useMemo(() => {
        let filtered = filterAccountId === 'all' ? transactions : transactions.filter(t => t.accountId === filterAccountId);

        if (searchKeyword.trim()) {
            const kw = searchKeyword.trim().toLowerCase();
            filtered = filtered.filter(t =>
                t.category?.toLowerCase().includes(kw) || t.note?.toLowerCase().includes(kw)
            );
        }
        if (filterCategory) {
            filtered = filtered.filter(t => t.category === filterCategory);
        }
        if (filterFromDate) {
            const from = new Date(filterFromDate);
            from.setHours(0, 0, 0, 0);
            filtered = filtered.filter(t => new Date(t.createdAt) >= from);
        }
        if (filterToDate) {
            const to = new Date(filterToDate);
            to.setHours(23, 59, 59, 999);
            filtered = filtered.filter(t => new Date(t.createdAt) <= to);
        }

        const groups = {};
        filtered.forEach(tx => {
            const key = new Date(tx.createdAt).toDateString();
            if (!groups[key]) groups[key] = { label: getDateLabel(tx.createdAt), txs: [] };
            groups[key].txs.push(tx);
        });
        return Object.values(groups);
    }, [transactions, filterAccountId, searchKeyword, filterCategory, filterFromDate, filterToDate]);

    const allCategories = [...CATEGORIES[formData.type], ...customCategories];
    const allCategoriesForFilter = [...CATEGORIES.expense, ...CATEGORIES.income];
    const activeFilterCount = [searchKeyword, filterCategory, filterFromDate, filterToDate].filter(Boolean).length;

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
                    setEditingTx(null);
                    setFormData({ type: 'expense', amount: '', category: '', note: '', accountId: defaultId });
                    setShowModal(true);
                }}>
                    <Plus size={20} />
                    Thêm mới
                </button>
            </div>

            <div className="filter-bar">
                <button
                    className={`filter-toggle-btn ${showFilter ? 'active' : ''}`}
                    onClick={() => setShowFilter(s => !s)}
                    aria-label="Bộ lọc nâng cao"
                >
                    <Filter size={16} />
                    Bộ lọc
                    {activeFilterCount > 0 && <span className="filter-badge">{activeFilterCount}</span>}
                </button>
                {activeFilterCount > 0 && (
                    <button className="filter-clear-btn" onClick={() => {
                        setSearchKeyword('');
                        setFilterCategory('');
                        setFilterFromDate('');
                        setFilterToDate('');
                    }}>
                        <X size={14} /> Xóa lọc
                    </button>
                )}
            </div>

            {showFilter && (
                <div className="filter-panel card">
                    <div className="filter-row">
                        <div className="filter-group">
                            <label>Tìm kiếm</label>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="Tìm theo danh mục, ghi chú..."
                                value={searchKeyword}
                                onChange={e => setSearchKeyword(e.target.value)}
                            />
                        </div>
                        <div className="filter-group">
                            <label>Danh mục</label>
                            <select className="input-field" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                                <option value="">Tất cả danh mục</option>
                                {allCategoriesForFilter.map(cat => (
                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="filter-row">
                        <div className="filter-group">
                            <label>Từ ngày</label>
                            <input type="date" className="input-field" value={filterFromDate} onChange={e => setFilterFromDate(e.target.value)} />
                        </div>
                        <div className="filter-group">
                            <label>Đến ngày</label>
                            <input type="date" className="input-field" value={filterToDate} onChange={e => setFilterToDate(e.target.value)} />
                        </div>
                    </div>
                </div>
            )}

            {groupedByDate.length === 0 ? (
                <div className="card">
                    <div className="empty-state">
                        <p>{activeFilterCount > 0 ? 'Không tìm thấy giao dịch phù hợp với bộ lọc.' : 'Chưa có giao dịch nào.'}</p>
                    </div>
                </div>
            ) : (
                groupedByDate.map(group => (
                    <div key={group.label} className="tx-date-group">
                        <div className="tx-date-header">{group.label}</div>
                        <div className="card tx-list-container">
                            {group.txs.map(tx => {
                                const accName = accounts.find(a => a.id === tx.accountId)?.name || 'Tài khoản ẩn';
                                const isTransfer = tx.type === 'transfer';
                                const catData = isTransfer
                                    ? { color: '#64748b', icon: ArrowLeftRight }
                                    : getCategoryData(tx.category, tx.type);
                                const IconComponent = catData.icon;
                                const transferLabel = isTransfer
                                    ? tx.transferDirection === 'out'
                                        ? `${accName} → ${accounts.find(a => a.id === tx.toAccountId)?.name || '?'}`
                                        : `${accounts.find(a => a.id === tx.fromAccountId)?.name || '?'} → ${accName}`
                                    : null;
                                return (
                                    <div key={tx.id} className="tx-list-item">
                                        <div className="tx-info">
                                            <div className="tx-icon" style={{ backgroundColor: `${catData.color}20`, color: catData.color }}>
                                                <IconComponent size={20} />
                                            </div>
                                            <div>
                                                <h4>{isTransfer ? 'Chuyển khoản' : tx.category}</h4>
                                                <p>{isTransfer ? transferLabel : accName}{tx.note && ` • ${tx.note}`}</p>
                                            </div>
                                        </div>
                                        <div className="tx-actions">
                                            <span className={`tx-amount ${isTransfer ? (tx.transferDirection === 'out' ? 'expense' : 'income') : tx.type}`}>
                                                {isTransfer
                                                    ? (tx.transferDirection === 'out' ? '-' : '+')
                                                    : (tx.type === 'income' ? '+' : '-')
                                                }{VND(tx.amount)}
                                            </span>
                                            {!isTransfer && (
                                                <button className="btn-icon" onClick={() => handleEdit(tx)} title="Sửa giao dịch" aria-label="Sửa giao dịch">
                                                    <Edit2 size={18} />
                                                </button>
                                            )}
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
                            <h2>{editingTx ? 'Sửa giao dịch' : 'Thêm giao dịch mới'}</h2>
                            <button className="btn-icon" onClick={handleCloseModal} aria-label="Đóng"><X size={24} /></button>
                        </div>

                        {/* Tab selector — ẩn tab Chuyển khoản khi đang ở mode edit */}
                        <div className="type-toggle">
                            <button type="button" className={`toggle-btn ${formData.type === 'expense' ? 'expense-active' : ''}`}
                                onClick={() => setFormData({ ...formData, type: 'expense', category: '' })}>Khoản Chi</button>
                            <button type="button" className={`toggle-btn ${formData.type === 'income' ? 'income-active' : ''}`}
                                onClick={() => setFormData({ ...formData, type: 'income', category: '' })}>Khoản Thu</button>
                            {!editingTx && (
                                <button type="button" className={`toggle-btn ${formData.type === 'transfer' ? 'transfer-active' : ''}`}
                                    onClick={() => setFormData({ ...formData, type: 'transfer', category: '' })}>
                                    <ArrowLeftRight size={14} style={{ display: 'inline', marginRight: '4px' }} />
                                    Chuyển khoản
                                </button>
                            )}
                        </div>

                        {formData.type === 'transfer' ? (
                            <form onSubmit={handleTransfer}>
                                <div className="form-group">
                                    <label>Từ tài khoản</label>
                                    <select className="input-field" value={transferData.fromAccountId}
                                        onChange={e => setTransferData({ ...transferData, fromAccountId: e.target.value })} required
                                        style={{ fontWeight: 600, color: 'var(--danger-color)' }}>
                                        <option value="">-- Tài khoản nguồn --</option>
                                        {accounts.map(acc => (
                                            <option key={acc.id} value={acc.id}>{acc.name} ({VND(acc.balance)})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Đến tài khoản</label>
                                    <select className="input-field" value={transferData.toAccountId}
                                        onChange={e => setTransferData({ ...transferData, toAccountId: e.target.value })} required
                                        style={{ fontWeight: 600, color: 'var(--success-color)' }}>
                                        <option value="">-- Tài khoản đích --</option>
                                        {accounts.map(acc => (
                                            <option key={acc.id} value={acc.id}>{acc.name} ({VND(acc.balance)})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Số tiền (VNĐ)</label>
                                    <CurrencyInput className="input-field amount-input" placeholder="0"
                                        value={transferData.amount} onChange={val => setTransferData({ ...transferData, amount: val })} required />
                                </div>
                                <div className="form-group">
                                    <label>Ghi chú (Tùy chọn)</label>
                                    <input type="text" className="input-field" placeholder="Lý do chuyển tiền"
                                        value={transferData.note} onChange={e => setTransferData({ ...transferData, note: e.target.value })} />
                                </div>
                                <button type="submit" className="btn-primary" disabled={submitting} style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}>
                                    {submitting ? 'Đang chuyển...' : 'Xác nhận chuyển tiền'}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={editingTx ? handleUpdate : handleAdd}>
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
                                    {submitting ? 'Đang lưu...' : editingTx ? 'Cập nhật' : 'Lưu giao dịch'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
