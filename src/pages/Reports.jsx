import { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { getTransactions } from '../utils/localStorage';
import { getCategoryData } from '../utils/categories';
import './Reports.css';

export default function Reports() {
    const [transactions, setTransactions] = useState([]);
    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        setTransactions(getTransactions());
    }, []);

    const { expenseData, incomeData, totalExpense, totalIncome } = useMemo(() => {
        const filtered = transactions.filter(tx => {
            const dt = new Date(tx.createdAt);
            return dt.getMonth() === month && dt.getFullYear() === year;
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
            } else {
                incMap[tx.category] = (incMap[tx.category] || 0) + amt;
                tInc += amt;
            }
        });

        const formatData = (mapObj, type) => {
            return Object.keys(mapObj).map(catName => {
                const catData = getCategoryData(catName, type);
                return {
                    name: catName,
                    value: mapObj[catName],
                    color: catData.color
                };
            }).sort((a, b) => b.value - a.value);
        };

        return {
            expenseData: formatData(expMap, 'expense'),
            incomeData: formatData(incMap, 'income'),
            totalExpense: tExp,
            totalIncome: tInc
        };
    }, [transactions, month, year]);

    const formatMoney = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip card" style={{ padding: '0.5rem 1rem' }}>
                    <p className="label" style={{ fontWeight: 600, margin: '0 0 0.5rem 0' }}>{`${payload[0].name}`}</p>
                    <p className="intro" style={{ color: payload[0].payload.color, margin: 0, fontWeight: 700 }}>
                        {formatMoney(payload[0].value)}
                    </p>
                </div>
            );
        }
        return null;
    };

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
                                    <Pie
                                        data={expenseData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={100}
                                        paddingAngle={2}
                                        dataKey="value"
                                    >
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
                                    <Pie
                                        data={incomeData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={100}
                                        paddingAngle={2}
                                        dataKey="value"
                                    >
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
        </div>
    );
}
