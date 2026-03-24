import { Download, Upload, Trash2, Database } from 'lucide-react';
import './More.css';

export default function More() {
    const handleExport = () => {
        const data = {
            users: localStorage.getItem('MF_USERS'),
            currentUser: localStorage.getItem('MF_CURRENT_USER'),
            accounts: localStorage.getItem('MF_ACCOUNTS'),
            transactions: localStorage.getItem('MF_TRANSACTIONS')
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `finance-backup-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                if (data.users) localStorage.setItem('MF_USERS', data.users);
                if (data.currentUser) localStorage.setItem('MF_CURRENT_USER', data.currentUser);
                if (data.accounts) localStorage.setItem('MF_ACCOUNTS', data.accounts);
                if (data.transactions) localStorage.setItem('MF_TRANSACTIONS', data.transactions);
                alert('Phục hồi dữ liệu thành công! Ứng dụng sẽ tải lại.');
                window.location.href = '/';
            } catch (err) {
                alert('File không hợp lệ hoặc bị lỗi!');
            }
        };
        reader.readAsText(file);
    };

    const handleClear = () => {
        if (confirm('CẢNH BÁO: Toàn bộ dữ liệu tài khoản và giao dịch sẽ bị xóa vĩnh viễn. Bạn có chắc chắn?')) {
            localStorage.removeItem('MF_ACCOUNTS');
            localStorage.removeItem('MF_TRANSACTIONS');
            alert('Đã xóa bộ nhớ cục bộ.');
            window.location.href = '/';
        }
    };

    return (
        <div className="more-page">
            <div className="page-header">
                <h1 className="page-title">Cài đặt & Công cụ</h1>
            </div>

            <div className="more-content">
                <div className="card settings-card">
                    <div className="settings-header">
                        <Database size={24} color="var(--primary-color)" />
                        <h3>Sao lưu & Phục hồi dữ liệu</h3>
                    </div>
                    <p className="settings-desc">
                        Dữ liệu của bạn được lưu an toàn trên trình duyệt này (LocalStorage). Hãy xuất file sao lưu phòng trường hợp bạn cài lại máy hoặc xóa bộ nhớ Cache.
                    </p>

                    <div className="settings-actions">
                        <button className="option-btn export-btn" onClick={handleExport}>
                            <Download size={20} />
                            Tải file Sao Lưu (.json)
                        </button>

                        <label className="option-btn import-btn">
                            <Upload size={20} />
                            Nạp file Cũ (Khôi phục)
                            <input type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport} />
                        </label>
                    </div>
                </div>

                <div className="card settings-card danger-zone">
                    <div className="settings-header">
                        <Trash2 size={24} color="var(--danger-color)" />
                        <h3 style={{ color: 'var(--danger-color)' }}>Vùng Nguy Hiểm</h3>
                    </div>
                    <p className="settings-desc">
                        Hard Reset toàn bộ cấu hình ví và lịch sử trên thiết bị này. Hành động không thể hoàn tác!
                    </p>
                    <button className="option-btn delete-btn" onClick={handleClear}>
                        Xóa mọi dữ liệu
                    </button>
                </div>
            </div>
        </div>
    );
}
