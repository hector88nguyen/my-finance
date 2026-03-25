import { test, expect } from '@playwright/test';

// Lưu ý: E2E test với Firebase Auth thật cần Firebase Emulator hoặc
// tài khoản test thật. Các kịch bản này được thiết kế để chạy với
// Firebase Emulator (VITE_USE_EMULATOR=true).
// Với môi trường live, các test sẽ sử dụng tài khoản test cố định.

test.describe('TC-E01: Luồng Xác thực (Authentication)', () => {
    test.beforeEach(async ({ page }) => {
        // Xóa tất cả storage kể cả IndexedDB để tránh session cũ
        await page.goto('/');
        await page.evaluate(async () => {
            localStorage.clear();
            sessionStorage.clear();
            // Xóa IndexedDB (Firebase lưu token ở đây)
            const dbs = await indexedDB.databases();
            for (const db of dbs) {
                indexedDB.deleteDatabase(db.name);
            }
        });
    });

    test('TC-E01a: Trang Login hiển thị đầy đủ Form Email/Password và nút Google', async ({ page }) => {
        await page.goto('/login');
        await expect(page.locator('input[type="email"]')).toBeVisible();
        await expect(page.locator('input[type="password"]')).toBeVisible();
        await expect(page.locator('button:has-text("Đăng nhập"), button:has-text("Đăng ký")')).toBeVisible();
        await expect(page.locator('button:has-text("Tiếp tục với Google")')).toBeVisible();
    });

    test('TC-E01b: Chuyển sang form Đăng ký khi click nút toggle', async ({ page }) => {
        await page.goto('/login');
        await page.locator('.btn-text').click();
        await expect(page.locator('h1:has-text("Tạo tài khoản mới")')).toBeVisible();
        await expect(page.locator('button[type="submit"]')).toContainText('Đăng ký');
    });

    test('TC-E01c: Hiển thị lỗi khi đăng nhập sai mật khẩu', async ({ page }) => {
        await page.goto('/login');
        await page.fill('input[type="email"]', 'nonexistent@example.com');
        await page.fill('input[type="password"]', 'wrongpassword');
        await page.click('button[type="submit"]');
        // Chờ thông báo lỗi (Firebase trả về lỗi auth)
        await expect(page.locator('.error-message')).toBeVisible({ timeout: 10000 });
    });

    test('TC-E01d: Redirect về /login khi truy cập trang protected chưa đăng nhập', async ({ page }) => {
        await page.goto('/#/');
        await expect(page).toHaveURL(/login/, { timeout: 5000 });
    });
});

test.describe('TC-E02: Luồng Quản lý Tài khoản (Accounts)', () => {
    // Lưu ý: Các test này yêu cầu user đã đăng nhập
    // Trong môi trường CI, cần thiết lập Firebase Auth Emulator
    test.skip('TC-E02a: Tạo tài khoản mới và hiển thị trong danh sách', async ({ page }) => {
        // Skip nếu chưa có Firebase Emulator setup
        await page.goto('/#/accounts');
        await page.locator('.add-acc-btn').click();
        await page.fill('input[placeholder="Vd: ATM, Thẻ tín dụng..."]', 'Ví Test E2E');
        await page.fill('input.amount-input', '10000000');
        await page.click('button:has-text("Lưu")');
        await expect(page.locator('.accounts-list')).toContainText('Ví Test E2E');
    });

    test.skip('TC-E02b: Nút Ẩn/Hiện số dư hoạt động', async ({ page }) => {
        await page.goto('/#/accounts');
        // Số dư đang hiển thị
        const balanceBefore = await page.locator('.balance-amount-row h2').textContent();
        expect(balanceBefore).toContain('₫');
        // Click ẩn
        await page.locator('.eye-btn').click();
        const balanceAfter = await page.locator('.balance-amount-row h2').textContent();
        expect(balanceAfter).toContain('***');
        // Click hiện lại
        await page.locator('.eye-btn').click();
        expect(await page.locator('.balance-amount-row h2').textContent()).toContain('₫');
    });
});

test.describe('TC-E03: Luồng Giao dịch (Transactions)', () => {
    test.skip('TC-E03a: Thêm giao dịch mới và hiển thị trong danh sách', async ({ page }) => {
        await page.goto('/#/transactions');
        await page.click('button:has-text("Thêm mới")');
        await expect(page.locator('h2:has-text("Thêm giao dịch mới")')).toBeVisible();
        // Chọn type Chi
        await page.click('button:has-text("Khoản Chi")');
        await page.fill('input.amount-input', '500000');
        await page.locator('select.input-field').nth(0).selectOption({ label: 'Ăn uống' });
        await page.fill('input[placeholder="Chi tiết giao dịch"]', 'Test E2E note');
        await page.click('button:has-text("Lưu giao dịch")');
        await expect(page.locator('.tx-list-item').first()).toContainText('Ăn uống');
    });

    test.skip('TC-E03b: Lọc giao dịch theo tài khoản', async ({ page }) => {
        await page.goto('/#/transactions');
        const filterSelect = page.locator('select').filter({ hasText: 'Tất cả tài khoản' });
        await filterSelect.selectOption({ index: 1 });
        // Dropdown filter phải không còn là 'all'
        await expect(filterSelect).not.toHaveValue('all');
    });

    test.skip('TC-E03c: Xóa giao dịch', async ({ page }) => {
        await page.goto('/#/transactions');
        const deleteBtn = page.locator('.delete-btn').first();
        page.on('dialog', dialog => dialog.accept());
        await deleteBtn.click();
        // Số lượng item giảm đi sau khi xóa
    });
});

test.describe('TC-E04: Luồng Báo cáo & Thống kê (Reports)', () => {
    test.skip('TC-E04a: Trang Báo cáo render được biểu đồ', async ({ page }) => {
        await page.goto('/#/reports');
        await expect(page.locator('.recharts-wrapper, svg')).toBeVisible({ timeout: 5000 });
    });
});

test.describe('TC-E05: Error Handling', () => {
    test('TC-E05a: Trang 404 redirect về trang chủ', async ({ page }) => {
        await page.goto('/#/nonexistent-page');
        // App redirect về / (nếu chưa login thì về /login)
        await expect(page).toHaveURL(/\/(login)?$/, { timeout: 3000 });
    });
});
