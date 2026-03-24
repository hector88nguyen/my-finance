import { describe, it, expect, beforeEach, vi } from 'vitest';
import { addAccount, editAccount, getAccounts, DB_ACCOUNT_KEY } from './localStorage';
import { getCategoryData } from './categories';

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: vi.fn(key => store[key] || null),
        setItem: vi.fn((key, value) => {
            store[key] = value.toString();
        }),
        removeItem: vi.fn(key => {
            delete store[key];
        }),
        clear: vi.fn(() => {
            store = {};
        }),
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

describe('Giai đoạn 1: Unit Test LocalStorage & Utils', () => {
    beforeEach(() => {
        window.localStorage.clear();
        vi.clearAllMocks();
    });

    it('TC-U01: Thêm Account - account được lưu đúng định dạng số balance', () => {
        const newAcc = addAccount({ name: 'Ví Test', balance: '5000000', icon: 'Wallet' });
        expect(newAcc.id).toBeDefined();
        expect(newAcc.balance).toStrictEqual(5000000); // Check number format
        expect(typeof newAcc.balance).toBe('number');

        const saved = JSON.parse(window.localStorage.setItem.mock.calls[0][1]);
        expect(saved.length).toBe(1);
        expect(saved[0].name).toBe('Ví Test');
    });

    it('TC-U02: Cập nhật Account - editAccount ghi đè chính xác', () => {
        // Insert mock data manually
        const initialData = [
            { id: 'acc_1', name: 'Ví Cũ', balance: 1000, icon: 'Wallet' },
            { id: 'acc_2', name: 'Ví Giữ Nguyên', balance: 5000, icon: 'Wallet' }
        ];
        window.localStorage.getItem.mockReturnValue(JSON.stringify(initialData));

        const updated = editAccount('acc_1', { name: 'Ví Mới', balance: '2000' });
        expect(updated.name).toBe('Ví Mới');
        expect(updated.balance).toBe(2000); // verify numeric parsing

        const saveCalls = window.localStorage.setItem.mock.calls;
        const finalData = JSON.parse(saveCalls[saveCalls.length - 1][1]);
        expect(finalData.length).toBe(2);
        expect(finalData.find(a => a.id === 'acc_1').name).toBe('Ví Mới');
        expect(finalData.find(a => a.id === 'acc_2').name).toBe('Ví Giữ Nguyên');
    });

    it('TC-U03: Lấy thuộc tính Category - getCategoryData hoạt động theo Map', () => {
        const validExpense = getCategoryData('Ăn uống', 'expense');
        expect(validExpense.color).toBe('#f59e0b');
        expect(validExpense.icon).toBeDefined();

        const fallbackCat = getCategoryData('Mục Lạ Hoắc', 'income');
        expect(fallbackCat.color).toBe('#94a3b8');
        expect(fallbackCat.name).toBe('Mục Lạ Hoắc');
    });
});
