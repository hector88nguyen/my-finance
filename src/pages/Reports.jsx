import { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Loader2, Plus, Trash2, X, Target } from 'lucide-react';
import { getTransactions, getBudgets, setBudget, deleteBudget } from '../services/firebaseService';
import { CATEGORIES, getCategoryData } from '../utils/categories';
import { useToast } from '../contexts/ToastContext';
import CurrencyInput from '../components/CurrencyInput';
import './Reports.css';

export default function Reports({ user }) {
    const { addToast } = useToast();
    const [transactions, setTransactions] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());

    // Budget modal state
    const [showBudgetModal, setShowBudgetModal] = useState(false);
    const [budgetForm, setBudgetForm] = useState({ categoryId: '', categoryName: '', amount: '' });
    const [savingBudget, setSavingBudget] = useState(false);

    const allExpenseCategories = CATEGORIES.expense;

    const fetchData = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const [txData, budgetData] = await Promise.all([
                getTransactions(user.uid),
                getBudgets(user.uid, month, year)
            ]);
            setTransactions(txData);
            setBudgets(budgetData);
        } catch (err) {
            console.error("Lỗi lấy dữ liệu báo cáo:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user, month, year]);

    const { expenseData, incomeData, totalExpense, totalIncome, expenseByCategory } = useMemo(() => {
        const filtered = transactions.filter(tx => {
            const dt = new Date(tx.createdAt);
            return dt.getMonth() === month && dt.getFullYear() === year && tx.type !== 'transfer';
        });

        const expMap = {};
        const incMap = {};
        let tExp = 0;
        let tInc = 0;

        filtered.forEach(tx => {
            const amt = Number(tx.amount);
            if (tx.type === 'expense') {
                expMap[tx.category] = (expMap[tx.category] || 0) + amt;
                tExp += amt;
            } else if (tx.type === 'income') {
                incMap[tx.category] = (incMap[tx.category] || 0) + amt;
                tInc += amt;
            }
        });

        const formatData = (mapObj, type) =>
            Object.keys(mapObj).map(catName => {
                const catData = getCategoryData(catName, type);
                return { name: catName, value: mapObj[catName], color: catData.color };
            }).sort((a, b) => b.value - a.value);

        return {
            expenseData: formatData(expMap, 'expense'),
            incomeData: formatData(incMap, 'income'),
            totalExpense: tExp,
            totalIncome: tInc,
            expenseByCategory: expMap
        };
    }, [transactions, month, year]);

    const formatMoney = (amount) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

    const handleSaveBudget = async (e) => {
        e.preventDefault();
        if (!budgetForm.categoryId || !budgetForm.amount) {
            addToast("Vui lòng chọn danh mục và nhập hạn mức.", 'error');
            return;
        }
        setSavingBudget(true);
        try {
            await setBudget(user.uid, { ...budgetForm, month, year });
            const updated = await getBudgets(user.uid, month, year);
            setBudgets(updated);
            setShowBudgetModal(false);
            setBudgetForm({ categoryId: '', categoryName: '', amount: '' });
            addToast("Đã lưu ngân sách.", 'success');
        } catch (err) {
            addToast("Lỗi lưu ngân sách: " + err.message, 'error');
        } finally {
            setSavingBudget(false);
        }
    };

    const handleDeleteBudget = async (id) => {
        if (!confirm('Xoá ngân sách này?')) return;
        try {
            await deleteBudget(id);
            setBudgets(prev => prev.filter(b => b.id !== id));
            addToast("Đã xoá ngân sách.", 'success');
        } catch (err) {
            addToast("Lỗi xoá: " + err.message, 'error');
        }
    };

    const getProgressColor = (pct) => {
        if (pct >= 100) return 'var(--danger-color)';
        if (pct >= 70) return '#f59e0b';
        return 'var(--success-color)';
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip card" style={{ padding: '0.5rem 1rem' }}>
                    <p style={{ fontWeight: 600, margin: '0 0 0.5rem 0' }}>{payload[0].name}</p>
                    <p style={{ color: payload[0].payload.color, margin: 0, fontWeight: 700 }}>
                        {formatMoney(payload[0].value)}
                    </p>
                </div>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <div className="empty-state" style={{ height: '60vh' }}>
                <Loader2 className="animate-spin" size={48} color="var(--primary-color)" />
                <p>Đang tải dữ liệu báo cáo...</p>
            </div>
        );
    }

    return (
        <div className="reports-page">
            <div className="page-header" style={{ flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between' }}>
                <h1 className="page-title" style={{ marginBottom: 0 }}>Báo cáo Thống kê</h1>
                <div className="month-selector">
                    <select className="input-field" value={month} onChange={e => setMonth(Number(e.target.value))}>
                        {Array.from({ length: 12 }).map((_, i) => (
                            <option key={i} value={i}>Tháng {i + 1}</option>
                        ))}
                    </select>
                    <select className="input-field" value={year} onChange={e => setYear(Number(e.target.value))}>
                        {[year - 1, year, year + 1].map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="reports-grid">
                <div className="card report-card">
                    <div className="report-card-header">
                        <h3>Cơ cấu Chi tiêu</h3>
                        <span className="total-badge expense-badge">-{formatMoney(totalExpense)}</span>
                    </div>
                    <div className="chart-container">
                        {expenseData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie data={expenseData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={2} dataKey="value">
                                        {expenseData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="empty-chart">Chưa có phát sinh chi tiêu trong tháng này</div>
                        )}
                    </div>
                </div>

                <div className="card report-card">
                    <div className="report-card-header">
                        <h3>Cơ cấu Thu nhập</h3>
                        <span className="total-badge income-badge">+{formatMoney(totalIncome)}</span>
                    </div>
                    <div className="chart-container">
                        {incomeData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie data={incomeData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={2} dataKey="value">
                                        {incomeData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="empty-chart">Chưa có phát sinh thu nhập trong tháng này</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Budget Section */}
            <div className="budget-section">
                <div className="budget-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Target size={20} color="var(--primary-color)" />
                        <h3>Ngân sách tháng {month + 1}/{year}</h3>
                    </div>
                    <button className="btn-primary" onClick={() => setShowBudgetModal(true)}>
                        <Plus size={16} /> Thêm hạn mức
                    </button>
                </div>

                {budgets.length === 0 ? (
                    <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        Chưa thiết lập ngân sách cho tháng này.
                    </div>
                ) : (
                    <div className="budget-list">
                        {budgets.map(budget => {
                            const spent = expenseByCategory[budget.categoryName] || 0;
                            const pct = budget.amount > 0 ? Math.min(Math.round((spent / budget.amount) * 100), 100) : 0;
                            const overBudget = spent > budget.amount;
                            const catData = getCategoryData(budget.categoryName, 'expense');
                            const IconComp = catData.icon;
                            return (
                                <div key={budget.id} className="card budget-item">
                                    <div className="budget-item-header">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div className="tx-icon" style={{ backgroundColor: `${catData.color}20`, color: catData.color, width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <IconComp size={16} />
                                            </div>
                                            <span className="budget-cat-name">{budget.categoryName}</span>
                                            {overBudget && <span className="budget-over-badge">Vượt!</span>}
                                        </div>
                                        <button className="btn-icon delete-btn" onClick={() => handleDeleteBudget(budget.id)} aria-label="Xoá ngân sách">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <div className="budget-progress-bar">
                                        <div
                                            className="budget-progress-fill"
                                            style={{ width: `${pct}%`, backgroundColor: getProgressColor(pct) }}
                                        />
                                    </div>
                                    <div className="budget-amounts">
                                        <span style={{ color: getProgressColor(pct), fontWeight: 600 }}>
                                            {formatMoney(spent)}
                                        </span>
                                        <span style={{ color: 'var(--text-muted)' }}>
                                            / {formatMoney(budget.amount)} ({pct}%)
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Budget Modal */}
            {showBudgetModal && (
                <div className="modal-overlay">
                    <div className="modal-content card">
                        <div className="modal-header">
                            <h2>Thiết lập ngân sách</h2>
                            <button className="btn-icon" onClick={() => setShowBudgetModal(false)} aria-label="Đóng"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSaveBudget}>
                            <div className="form-group">
                                <label>Danh mục chi tiêu</label>
                                <select className="input-field" value={budgetForm.categoryId}
                                    onChange={e => {
                                        const cat = allExpenseCategories.find(c => c.id === e.target.value);
                                        setBudgetForm({ ...budgetForm, categoryId: e.target.value, categoryName: cat?.name || '' });
                                    }} required>
                                    <option value="">-- Chọn danh mục --</option>
                                    {allExpenseCategories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Hạn mức (VNĐ/tháng)</label>
                                <CurrencyInput className="input-field amount-input" placeholder="0"
                                    value={budgetForm.amount} onChange={val => setBudgetForm({ ...budgetForm, amount: val })} required />
                            </div>
                            <button type="submit" className="btn-primary" disabled={savingBudget} style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}>
                                {savingBudget ? 'Đang lưu...' : 'Lưu ngân sách'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
