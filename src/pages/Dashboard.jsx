import { useState, useEffect, useMemo } from 'react';
import { ArrowUpRight, ArrowDownRight, Wallet, Activity, Loader2 } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { getTransactions, getAccounts } from '../services/firebaseService';
import './Dashboard.css';

const VND = (amount) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: 8, padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                <p style={{ fontWeight: 700, marginBottom: 4 }}>{label}</p>
                {payload.map(p => (
                    <p key={p.name} style={{ color: p.fill, margin: '2px 0' }}>{p.name}: {VND(p.value)}</p>
                ))}
            </div>
        );
    }
    return null;
};

export default function Dashboard({ user }) {
    const [transactions, setTransactions] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [chartFilter, setChartFilter] = useState('month'); // 'week' | 'month'
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (user) {
                try {
                    const [txData, accData] = await Promise.all([
                        getTransactions(user.uid),
                        getAccounts(user.uid),
                    ]);
                    setTransactions(txData);
                    setAccounts(accData);
                } catch (err) {
                    console.error("Lỗi lấy dữ liệu:", err);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchData();
    }, [user]);

    // Total assets = sum of actual account balances
    const totalAssets = accounts.reduce((s, acc) => s + Number(acc.balance || 0), 0);

    // Income/expense filtered to current month only
    const now = new Date();
    const thisMonthTx = transactions.filter(t => {
        const d = new Date(t.createdAt);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const totalIncome = thisMonthTx.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
    const totalExpense = thisMonthTx.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);

    const chartData = useMemo(() => {
        const now = new Date();

        if (chartFilter === 'week') {
            return Array.from({ length: 7 }, (_, i) => {
                const d = new Date(now);
                d.setDate(now.getDate() - (6 - i));
                const label = d.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit' });
                const dayStr = d.toDateString();
                const dayTx = transactions.filter(t => new Date(t.createdAt).toDateString() === dayStr);
                return {
                    label,
                    'Thu nhập': dayTx.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0),
                    'Chi tiêu': dayTx.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0),
                };
            });
        } else {
            const year = now.getFullYear();
            const month = now.getMonth();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            return Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const dayTx = transactions.filter(t => {
                    const d = new Date(t.createdAt);
                    return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
                });
                return {
                    label: `${day}`,
                    'Thu nhập': dayTx.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0),
                    'Chi tiêu': dayTx.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0),
                };
            }).filter(d => d['Thu nhập'] > 0 || d['Chi tiêu'] > 0);
        }
    }, [transactions, chartFilter]);

    const recentTransactions = transactions.slice(0, 5);

    if (loading) {
        return (
            <div className="empty-state" style={{ height: '60vh' }}>
                <Loader2 className="animate-spin" size={48} color="var(--primary-color)" />
                <p>Đang tải dữ liệu...</p>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <h1 className="page-title">Tổng quan</h1>

            <div className="summary-cards">
                <div className="card summary-card balance-card">
                    <div className="card-icon"><Wallet size={24} /></div>
                    <div className="card-content">
                        <p>Tổng tài sản</p>
                        <h3 style={totalAssets < 0 ? { color: 'var(--danger-color)' } : {}}>{VND(totalAssets)}</h3>
                    </div>
                </div>
                <div className="card summary-card income-card">
                    <div className="card-icon"><ArrowUpRight size={24} /></div>
                    <div className="card-content">
                        <p>Tổng thu (Tháng này)</p>
                        <h3>{VND(totalIncome)}</h3>
                    </div>
                </div>
                <div className="card summary-card expense-card">
                    <div className="card-icon"><ArrowDownRight size={24} /></div>
                    <div className="card-content">
                        <p>Tổng chi (Tháng này)</p>
                        <h3>{VND(totalExpense)}</h3>
                    </div>
                </div>
            </div>

            <div className="card chart-section">
                <div className="chart-header">
                    <h2>Biểu đồ Thu / Chi</h2>
                    <div className="chart-filter-tabs">
                        <button
                            className={`filter-tab ${chartFilter === 'month' ? 'active' : ''}`}
                            onClick={() => setChartFilter('month')}
                        >Tháng</button>
                        <button
                            className={`filter-tab ${chartFilter === 'week' ? 'active' : ''}`}
                            onClick={() => setChartFilter('week')}
                        >Tuần</button>
                    </div>
                </div>
                {chartData.length === 0 ? (
                    <div className="empty-chart-msg">Chưa có dữ liệu trong {chartFilter === 'month' ? 'tháng' : 'tuần'} này.</div>
                ) : (
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                            <YAxis tickFormatter={v => v >= 1000000 ? `${(v / 1000000).toFixed(0)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v} tick={{ fontSize: 11 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar dataKey="Thu nhập" fill="#10b981" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Chi tiêu" fill="#ef4444" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>

            <div className="recent-section">
                <div className="section-header">
                    <h2>Giao dịch gần đây</h2>
                </div>
                <div className="card recent-list">
                    {recentTransactions.length === 0 ? (
                        <div className="empty-state">
                            <Activity size={48} color="var(--text-muted)" />
                            <p>Chưa có giao dịch nào.</p>
                        </div>
                    ) : (
                        recentTransactions.map(tx => (
                            <div key={tx.id} className="tx-item">
                                <div className="tx-info">
                                    <div className={`tx-icon ${tx.type}`}>
                                        {tx.type === 'income' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                                    </div>
                                    <div>
                                        <h4>{tx.category}</h4>
                                        <p>{new Date(tx.createdAt).toLocaleDateString('vi-VN')} {tx.note && `• ${tx.note}`}</p>
                                    </div>
                                </div>
                                <div className={`tx-amount ${tx.type}`}>
                                    {tx.type === 'income' ? '+' : '-'}{VND(tx.amount)}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
