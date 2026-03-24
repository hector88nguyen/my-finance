const DB_USER_KEY = 'my_finance_user';
const DB_TRANS_KEY = 'my_finance_transactions';
const DB_ACCOUNT_KEY = 'my_finance_accounts';

export const initDefaultAccounts = () => {
    const current = localStorage.getItem(DB_ACCOUNT_KEY);
    if (!current || JSON.parse(current).length === 0) {
        const defaultAccounts = [
            { id: 'acc_1', name: 'Tiền mặt', balance: 0, icon: 'Wallet' },
            { id: 'acc_2', name: 'ATM', balance: 0, icon: 'CreditCard' }
        ];
        localStorage.setItem(DB_ACCOUNT_KEY, JSON.stringify(defaultAccounts));
    }
};

export const loginUser = (username, password) => {
    if (username.length > 3 && password.length > 3) {
        const user = { id: 1, name: username, token: 'fake-token-123' };
        localStorage.setItem(DB_USER_KEY, JSON.stringify(user));
        initDefaultAccounts();
        return user;
    }
    throw new Error('Tài khoản hoặc mật khẩu không hợp lệ (cần >3 ký tự)');
};

export const logoutUser = () => {
    localStorage.removeItem(DB_USER_KEY);
};

export const getCurrentUser = () => {
    try {
        const userStr = localStorage.getItem(DB_USER_KEY);
        return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
        return null;
    }
};

export const getAccounts = () => {
    try {
        const accStr = localStorage.getItem(DB_ACCOUNT_KEY);
        return accStr ? JSON.parse(accStr) : [];
    } catch (e) { return []; }
};

export const addAccount = (account) => {
    const current = getAccounts();
    const newAcc = {
        ...account,
        id: 'acc_' + Date.now(),
        balance: Number(account.balance || 0)
    };
    localStorage.setItem(DB_ACCOUNT_KEY, JSON.stringify([...current, newAcc]));
    return newAcc;
};

export const editAccount = (id, updatedData) => {
    const current = getAccounts();
    const accIndex = current.findIndex(a => a.id === id);
    if (accIndex !== -1) {
        const numBalance = updatedData.balance !== undefined ? Number(updatedData.balance) : current[accIndex].balance;
        current[accIndex] = { ...current[accIndex], ...updatedData, balance: numBalance };
        localStorage.setItem(DB_ACCOUNT_KEY, JSON.stringify(current));
        return current[accIndex];
    }
    throw new Error("Không tìm thấy tài khoản");
};

export const getTransactions = () => {
    try {
        const tx = localStorage.getItem(DB_TRANS_KEY);
        return tx ? JSON.parse(tx) : [];
    } catch (e) {
        return [];
    }
};

export const addTransaction = (transaction) => {
    const currentTx = getTransactions();
    const tx = {
        ...transaction,
        id: 'tx_' + Date.now(),
        createdAt: new Date().toISOString()
    };
    localStorage.setItem(DB_TRANS_KEY, JSON.stringify([tx, ...currentTx]));

    if (tx.accountId) {
        const accounts = getAccounts();
        const accIndex = accounts.findIndex(a => a.id === tx.accountId);
        if (accIndex !== -1) {
            if (tx.type === 'income') {
                accounts[accIndex].balance += Number(tx.amount);
            } else {
                accounts[accIndex].balance -= Number(tx.amount);
            }
            localStorage.setItem(DB_ACCOUNT_KEY, JSON.stringify(accounts));
        }
    }
    return tx;
};

export const deleteTransaction = (id) => {
    const current = getTransactions();
    const tx = current.find(t => t.id === id);
    const next = current.filter(t => t.id !== id);
    localStorage.setItem(DB_TRANS_KEY, JSON.stringify(next));

    if (tx && tx.accountId) {
        const accounts = getAccounts();
        const accIndex = accounts.findIndex(a => a.id === tx.accountId);
        if (accIndex !== -1) {
            if (tx.type === 'income') {
                accounts[accIndex].balance -= Number(tx.amount);
            } else {
                accounts[accIndex].balance += Number(tx.amount);
            }
            localStorage.setItem(DB_ACCOUNT_KEY, JSON.stringify(accounts));
        }
    }
    return next;
};
