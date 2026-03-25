import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCategoryData, CATEGORIES } from './categories';

// ─────────────────────────────────────────────
// TC-U01: getCategoryData - Map đúng danh mục chi tiêu
// ─────────────────────────────────────────────
describe('Giai đoạn 1 – Unit Test: getCategoryData()', () => {
    it('TC-U01a: Trả về color và icon đúng cho danh mục "Ăn uống"', () => {
        const result = getCategoryData('Ăn uống', 'expense');
        expect(result.color).toBe('#f59e0b');
        expect(result.icon).toBeDefined();
    });

    it('TC-U01b: Trả về fallback color khi danh mục không tồn tại', () => {
        const fallback = getCategoryData('Danh mục lạ', 'expense');
        expect(fallback.color).toBe('#94a3b8');
        expect(fallback.name).toBe('Danh mục lạ');
    });

    it('TC-U01c: Trả về đúng danh mục thu nhập "Tiền lương"', () => {
        const result = getCategoryData('Tiền lương', 'income');
        expect(result.color).toBeDefined();
        expect(result.icon).toBeDefined();
    });

    it('TC-U01d: CATEGORIES object có đủ 2 khóa expense và income', () => {
        expect(CATEGORIES).toHaveProperty('expense');
        expect(CATEGORIES).toHaveProperty('income');
        expect(Array.isArray(CATEGORIES.expense)).toBe(true);
        expect(CATEGORIES.expense.length).toBeGreaterThan(0);
    });
});

// ─────────────────────────────────────────────
// TC-U02: Định dạng tiền tệ VND
// ─────────────────────────────────────────────
describe('Giai đoạn 1 – Unit Test: Định dạng VND', () => {
    const VND = (amount) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

    it('TC-U02a: Format số 1000000 thành tiếng Việt đúng chuẩn', () => {
        const formatted = VND(1000000);
        expect(formatted).toContain('1');
        expect(formatted).toContain('₫');
    });

    it('TC-U02b: Format số âm ra dấu trừ', () => {
        const formatted = VND(-500000);
        expect(formatted).toContain('-');
    });

    it('TC-U02c: Format số 0 không bị lỗi', () => {
        const formatted = VND(0);
        expect(formatted).toContain('₫');
    });
});
