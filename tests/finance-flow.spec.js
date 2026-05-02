import { test, expect } from '@playwright/test';

// Chạy xóa storage trước mỗi test để test hoàn toàn độc lập
test.beforeEach(async ({ page }) => {
    await page.goto('/my-finance/');
    await page.evaluate(async () => {
        localStorage.clear();
        sessionStorage.clear();
        // Xóa IndexedDB (nơi Firebase lưu token)
        const dbs = await indexedDB.databases();
        for (const db of dbs) {
            indexedDB.deleteDatabase(db.name);
        }
    });
});

// ==========================================
// NHÓM 1: CÁC TEST KHÔNG YÊU CẦU ĐĂNG NHẬP
// ==========================================
test.describe('TC-E01: Luồng Xác thực (Authentication)', () => {
    test('TC-E01a: Trang Login hiển thị đầy đủ', async ({ page }) => {
        await page.goto('/my-finance/#/login');
        await expect(page.locator('input[type="email"]')).toBeVisible();
        await expect(page.locator('input[type="password"]')).toBeVisible();
        await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('TC-E01b: Chuyển sang form Đăng ký', async ({ page }) => {
        await page.goto('/my-finance/#/login');
        await page.locator('.btn-text').click();
        await expect(page.locator('h1:has-text("Tạo tài khoản mới")')).toBeVisible();
    });

    test('TC-E01c: Lỗi đăng nhập sai', async ({ page }) => {
        await page.goto('/my-finance/#/login');
        await page.fill('input[type="email"]', 'nonexistent@example.com');
        await page.fill('input[type="password"]', 'wrongpassword');
        await page.click('button[type="submit"]');
        await expect(page.locator('.error-message')).toBeVisible({ timeout: 10000 });
    });

    test('TC-E01d: Redirect khi chưa đăng nhập', async ({ page }) => {
        await page.goto('/my-finance/#/accounts');
        await expect(page).toHaveURL(/login/, { timeout: 5000 });
    });
});

test.describe('TC-E05: Error Handling', () => {
    test('TC-E05a: 404 redirect', async ({ page }) => {
        await page.goto('/my-finance/#/404page-not-found');
        await expect(page).toHaveURL(/\/(login)?$/, { timeout: 3000 });
    });
});


// ==========================================
// NHÓM 2: CÁC TEST YÊU CẦU ĐĂNG NHẬP
// ==========================================
test.describe('Authed Tests (Skip-CI)', () => {
    
    // Đăng ký tài khoản tự động trước mỗi test
    test.beforeEach(async ({ page }) => {
        await page.goto('/my-finance/#/login');
        await page.locator('.btn-text').click(); 
        await page.fill('input[type="email"]', `e2e_${Date.now()}_${Math.floor(Math.random() * 1000)}@test.com`);
        await page.fill('input[type="password"]', 'password123');
        await page.click('button[type="submit"]');
        
        try {
            // Đợi đến khi redirect vào trong (Dashboard)
            await expect(page).toHaveURL(/\/#\/$/, { timeout: 8000 });
        } catch (error) {
            const errUI = await page.locator('.error-message').textContent({ timeout: 1000 }).catch(() => 'Không có hộp thoại lỗi hiển thị');
            console.error('🔥 [DEBUG] Playwright Login failed. Lỗi hiển thị trên UI:', errUI);
            throw error;
        }
    });

    test.describe('TC-E02: Quản lý Tài khoản', () => {
        test('TC-E02a: Tạo tài khoản mới', async ({ page }) => {
            await page.goto('/my-finance/#/accounts');
            await page.locator('.add-acc-btn').click();
            await page.fill('input[placeholder="Vd: ATM, Thẻ tín dụng..."]', 'Ví E2E');
            await page.fill('input.amount-input', '5000000');
            await page.click('button:has-text("Lưu")');
            // Đợi hệ thống save xong để tránh break Firestore connection
            await expect(page.locator('.accounts-list')).toContainText('Ví E2E', { timeout: 10000 });
            await expect(page.locator('.accounts-list')).toContainText('Ví E2E');
        });

        test('TC-E02b: Ẩn/Hiện số dư', async ({ page }) => {
            await page.goto('/my-finance/#/accounts');
            // Tạo tạm 1 ví để có số tiền > 0
            await page.locator('.add-acc-btn').click();
            await page.fill('input[placeholder="Vd: ATM, Thẻ tín dụng..."]', 'Ví E2E');
            await page.fill('input.amount-input', '5000000');
            await page.click('button:has-text("Lưu")');
            // Đợi hệ thống save xong để tránh break Firestore connection
            await expect(page.locator('.accounts-list')).toContainText('Ví E2E', { timeout: 10000 });

            const balance = page.locator('.balance-amount-row h2');
            await expect(balance).toContainText('₫');
            await page.locator('.eye-btn').click();
            await expect(balance).toContainText('***');
            await page.locator('.eye-btn').click();
            await expect(balance).toContainText('₫');
        });

        test('TC-E02c: Sửa tài khoản', async ({ page }) => {
            await page.goto('/my-finance/#/accounts');
            // Tạo tài khoản trước
            await page.locator('.add-acc-btn').click();
            await page.fill('input[placeholder="Vd: ATM, Thẻ tín dụng..."]', 'Ví Edit');
            await page.fill('input.amount-input', '1000000');
            await page.click('button:has-text("Lưu")');
            await expect(page.locator('.accounts-list')).toContainText('Ví Edit', { timeout: 10000 });

            // Sửa tài khoản
            const accountCard = page.locator('.acc-item').filter({ hasText: 'Ví Edit' }).first();
            await accountCard.locator('.more-btn').click();
            await page.fill('input[placeholder="Tên tài khoản"]', 'Ví Edited');
            await page.fill('input.amount-input', '2000000');
            await page.click('button:has-text("Cập nhật")');

            // Kiểm tra update
            await expect(page.locator('.accounts-list')).toContainText('Ví Edited', { timeout: 10000 });
            await expect(page.locator('.accounts-list')).not.toContainText('Ví Edit');
        });

        test('TC-E02d: Xóa tài khoản', async ({ page }) => {
            await page.goto('/my-finance/#/accounts');
            // Tạo tài khoản
            await page.locator('.add-acc-btn').click();
            await page.fill('input[placeholder="Vd: ATM, Thẻ tín dụng..."]', 'Ví Delete');
            await page.fill('input.amount-input', '1000000');
            await page.click('button:has-text("Lưu")');
            await expect(page.locator('.accounts-list')).toContainText('Ví Delete', { timeout: 10000 });

            // Xóa tài khoản
            const accountCard = page.locator('.acc-item').filter({ hasText: 'Ví Delete' }).first();
            await accountCard.locator('.more-btn').click();
            page.on('dialog', dialog => dialog.accept());
            await page.click('button[aria-label="Xoá tài khoản"]');
            await expect(page.locator('.accounts-list')).not.toContainText('Ví Delete', { timeout: 10000 });
        });
    });

    test.describe('TC-E03: Quản lý Giao dịch', () => {
        test.beforeEach(async ({ page }) => {
            // Cần tạo tài khoản trước
            await page.goto('/my-finance/#/accounts');
            await page.locator('.add-acc-btn').click();
            await page.fill('input[placeholder="Vd: ATM, Thẻ tín dụng..."]', 'Ví E2E');
            await page.fill('input.amount-input', '10000000');
            await page.click('button:has-text("Lưu")');
            // Đợi hệ thống save xong để tránh break Firestore connection
            await expect(page.locator('.accounts-list')).toContainText('Ví E2E', { timeout: 10000 });
        });

        test('TC-E03a: Thêm giao dịch chi', async ({ page }) => {
            await page.goto('/my-finance/#/transactions');
            await page.click('button:has-text("Thêm mới")');
            await page.click('button:has-text("Khoản Chi")');
            await page.fill('input.amount-input', '100000');
            await page.locator('select.input-field').nth(0).selectOption({ label: 'Ăn uống' });
            await page.fill('input[placeholder="Chi tiết giao dịch"]', 'Phở bò E2E');
            await page.click('button:has-text("Lưu giao dịch")');
            await expect(page.locator('.tx-list-item').first()).toContainText('Ăn uống');
        });

        test('TC-E03b: Lọc giao dịch', async ({ page }) => {
            await page.goto('/my-finance/#/transactions');
            const select = page.locator('select').filter({ hasText: 'Tất cả tài khoản' });
            await select.selectOption({ index: 1 });
            await expect(select).not.toHaveValue('all');
        });

        test('TC-E03c: Xóa giao dịch', async ({ page }) => {
            await page.goto('/my-finance/#/transactions');
            await page.click('button:has-text("Thêm mới")');
            await page.fill('input.amount-input', '100000');
            await page.locator('select.input-field').nth(0).selectOption({ label: 'Ăn uống' });
            await page.click('button:has-text("Lưu giao dịch")');

            const deleteBtn = page.locator('.delete-btn').first();
            page.on('dialog', dialog => dialog.accept());
            await deleteBtn.click();
            await expect(page.locator('.tx-list-item')).toHaveCount(0);
        });

        test('TC-E03d: Sửa giao dịch', async ({ page }) => {
            await page.goto('/my-finance/#/transactions');
            // Thêm mới trước
            await page.click('button:has-text("Thêm mới")');
            await page.fill('input.amount-input', '200000');
            await page.locator('select.input-field').nth(0).selectOption({ label: 'Mua sắm' });
            await page.fill('input[placeholder="Chi tiết giao dịch"]', 'Áo thun');
            await page.click('button:has-text("Lưu giao dịch")');
            await expect(page.locator('.tx-list-item').first()).toContainText('Áo thun');

            // Edit
            await page.locator('button[aria-label="Sửa giao dịch"]').first().click();
            await page.fill('input.amount-input', '250000');
            await page.fill('input[placeholder="Chi tiết giao dịch"]', 'Áo thun (Edit)');
            await page.click('button:has-text("Cập nhật")');
            await expect(page.locator('.tx-list-item').first()).toContainText('Áo thun (Edit)');
            await expect(page.locator('.tx-list-item').first()).toContainText('250.000');
        });

        test('TC-E03e: Chuyển tiền giữa các tài khoản', async ({ page }) => {
            await page.goto('/my-finance/#/accounts');
            // Thêm tài khoản đích
            await page.locator('.add-acc-btn').click();
            await page.fill('input[placeholder="Vd: ATM, Thẻ tín dụng..."]', 'Ví Nhận E2E');
            await page.fill('input.amount-input', '0');
            await page.click('button:has-text("Lưu")');
            await expect(page.locator('.accounts-list')).toContainText('Ví Nhận E2E', { timeout: 10000 });

            await page.goto('/my-finance/#/transactions');
            await page.click('button:has-text("Thêm mới")');
            await page.click('button:has-text("Chuyển khoản")');
            
            // Chọn tài khoản nguồn/đích
            await page.locator('select').filter({ hasText: '-- Tài khoản nguồn --' }).selectOption({ label: /Ví E2E/ });
            await page.locator('select').filter({ hasText: '-- Tài khoản đích --' }).selectOption({ label: /Ví Nhận E2E/ });
            await page.fill('input.amount-input', '500000');
            await page.fill('input[placeholder="Lý do chuyển tiền"]', 'Test chuyển khoản');
            await page.click('button:has-text("Xác nhận chuyển tiền")');
            
            await expect(page.locator('.tx-list-item').first()).toContainText('Chuyển khoản');
            await expect(page.locator('.tx-list-item').first()).toContainText('Test chuyển khoản');
        });

        test('TC-E03f: Tìm kiếm và lọc giao dịch', async ({ page }) => {
            await page.goto('/my-finance/#/transactions');
            // Mở panel filter
            await page.click('button.filter-toggle-btn');
            await page.fill('input[placeholder="Tìm theo danh mục, ghi chú..."]', 'KhongTonTai123');
            await expect(page.locator('.tx-list-container')).toHaveCount(0);
            await expect(page.locator('.empty-state')).toContainText('Không tìm thấy giao dịch phù hợp');

            await page.fill('input[placeholder="Tìm theo danh mục, ghi chú..."]', '');
            await page.locator('select').filter({ hasText: 'Tất cả danh mục' }).selectOption({ label: 'Ăn uống' });
            // Không test rỗng ở đây vì có thể có data hoặc không, nhưng chắc chắn UI không crash
        });
    });

    test.describe('TC-E04: Báo cáo', () => {
        test.beforeEach(async ({ page }) => {
            // Tạo tài khoản và giao dịch để có dữ liệu vẽ biểu đồ
            await page.goto('/my-finance/#/accounts');
            await page.locator('.add-acc-btn').click();
            await page.fill('input[placeholder="Vd: ATM, Thẻ tín dụng..."]', 'Ví E2E');
            await page.fill('input.amount-input', '10000000');
            await page.click('button:has-text("Lưu")');
            await expect(page.locator('.accounts-list')).toContainText('Ví E2E', { timeout: 10000 });

            await page.goto('/my-finance/#/transactions');
            await page.click('button:has-text("Thêm mới")');
            await page.click('button:has-text("Khoản Chi")');
            await page.fill('input.amount-input', '500000');
            await page.locator('select.input-field').nth(0).selectOption({ label: 'Ăn uống' });
            await page.click('button:has-text("Lưu giao dịch")');
            await expect(page.locator('.tx-list-item').first()).toContainText('Ăn uống', { timeout: 10000 });
        });

        test('TC-E04a: Trang Báo cáo render biểu đồ', async ({ page }) => {
            await page.goto('/my-finance/#/reports');
            // Cần đợi Recharts render SVG
            await expect(page.locator('.recharts-wrapper, svg').first()).toBeVisible({ timeout: 10000 });
        });
    });

    test.describe('TC-E06: Tính năng mở rộng & UI', () => {
        test('TC-E06a: Thay đổi giao diện Dark Mode', async ({ page }) => {
            await page.goto('/my-finance/#/accounts');
            const html = page.locator('html');
            const themeBtn = page.locator('.theme-toggle').first();
            
            // Kiểm tra toggle class dark trên HTML
            await themeBtn.click();
            const hasDarkClassAfterClick1 = await html.evaluate(node => node.classList.contains('dark'));
            
            await themeBtn.click();
            const hasDarkClassAfterClick2 = await html.evaluate(node => node.classList.contains('dark'));

            // Một trong 2 click phải tạo ra sự thay đổi (1 true, 1 false)
            expect(hasDarkClassAfterClick1).not.toBe(hasDarkClassAfterClick2);
        });
    });
});
