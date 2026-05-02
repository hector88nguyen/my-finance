import { useState } from 'react';
import { Trash2, Database, LogOut, User, RefreshCw, Loader2 } from 'lucide-react';
import { signOutUser, addAccount, addTransaction } from '../services/firebaseService';
import { getAccounts, getTransactions } from '../utils/localStorage';
import { useToast } from '../contexts/ToastContext';
import './More.css';

export default function More({ user }) {
    const { addToast } = useToast();
    const [migrating, setMigrating] = useState(false);

    const handleLogout = async () => {
        if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
            await signOutUser();
        }
    };

    const handleMigrate = async () => {
        if (!user) return;
        const localAccs = getAccounts();
        const localTxs = getTransactions();

        if (localAccs.length === 0 && localTxs.length === 0) {
            addToast("Không tìm thấy dữ liệu cũ trong trình duyệt này.", 'error');
            return;
        }

        if (confirm(`Tìm thấy ${localAccs.length} tài khoản và ${localTxs.length} giao dịch cũ. Bạn có muốn đưa chúng lên Cloud không? (Có thể gây trùng lặp nếu đã thực hiện trước đó)`)) {
            setMigrating(true);
            try {
                const accMap = {};
                for (const acc of localAccs) {
                    const newAcc = await addAccount(user.uid, {
                        name: acc.name,
                        balance: acc.balance,
                        icon: acc.icon
                    });
                    accMap[acc.id] = newAcc.id;
                }

                for (const tx of localTxs) {
                    await addTransaction(user.uid, {
                        type: tx.type,
                        amount: tx.amount,
                        category: tx.category,
                        note: tx.note,
                        accountId: accMap[tx.accountId] || ''
                    });
                }

                addToast("Dữ liệu đã được di trú lên Cloud thành công!", 'success');
            } catch (err) {
                addToast("Lỗi di trú: " + err.message, 'error');
            } finally {
                setMigrating(false);
            }
        }
    };

    const handleClearLocal = () => {
        if (confirm('Xóa bộ nhớ tạm của trình duyệt? (Không ảnh hưởng đến dữ liệu Cloud)')) {
            localStorage.clear();
            addToast('Đã dọn dẹp bộ nhớ tạm.', 'success');
            window.location.reload();
        }
    };

    return (
        <div className="more-page">
            <div className="page-header">
                <h1 className="page-title">Cài đặt</h1>
            </div>

            <div className="more-content">
                {/* User Info */}
                <div className="card settings-card">
                    <div className="settings-header">
                        <User size={24} color="var(--primary-color)" />
                        <h3>Tài khoản</h3>
                    </div>
                    <div className="user-profile-info" style={{ marginTop: '1rem' }}>
                        <p><strong>Email:</strong> {user?.email}</p>
                        <p><strong>UID:</strong> <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{user?.uid}</span></p>
                    </div>
                    <button className="option-btn logout-btn" onClick={handleLogout} style={{ marginTop: '1.5rem', width: '100%', color: 'var(--danger-color)', borderColor: 'var(--danger-color)' }}>
                        <LogOut size={20} />
                        Đăng xuất
                    </button>
                </div>

                {/* Migration Tool */}
                <div className="card settings-card">
                    <div className="settings-header">
                        <RefreshCw size={24} color="var(--primary-color)" />
                        <h3>Di trú dữ liệu</h3>
                    </div>
                    <p className="settings-desc">
                        Chuyển toàn bộ dữ liệu từ bộ nhớ trình duyệt (LocalStorage) cũ của bạn lên đám mây (Cloud).
                    </p>
                    <button className="option-btn migrate-btn" onClick={handleMigrate} disabled={migrating} style={{ backgroundColor: 'var(--primary-color)', color: 'white', border: 'none' }}>
                        {migrating ? <Loader2 className="animate-spin" size={20} /> : <Database size={20} />}
                        {migrating ? 'Đang di trú...' : 'Đưa dữ liệu lên Cloud'}
                    </button>
                </div>

                {/* Danger Zone */}
                <div className="card settings-card danger-zone">
                    <div className="settings-header">
                        <Trash2 size={24} color="var(--danger-color)" />
                        <h3 style={{ color: 'var(--danger-color)' }}>Bộ nhớ tạm</h3>
                    </div>
                    <p className="settings-desc">
                        Xóa dữ liệu cũ đang lưu trên trình duyệt này.
                    </p>
                    <button className="option-btn delete-btn" onClick={handleClearLocal}>
                        Dọn dẹp trình duyệt
                    </button>
                </div>
            </div>
        </div>
    );
}
