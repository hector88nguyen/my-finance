import { test, expect } from '@playwright/test';

test.describe('Giai đoạn 3: E2E Finance Flow', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.evaluate(() => {
            localStorage.clear();
        });
    });

    test('TC-E01, TC-E02, TC-E03: Luồng Đăng nhập, Tạo ví và Thêm giao dịch', async ({ page }) => {
        // 1. Login
        await page.goto('/login');
        await page.fill('input[placeholder="Nhập tên đăng nhập"]', 'UserE2E');
        await page.fill('input[placeholder="Nhập mật khẩu"]', '1234');
        await page.click('button:has-text("Đăng nhập")');

        // Welcome Dashboard
        await expect(page).toHaveURL('/');

        // 2. Navigate Accounts
        await page.locator('.sidebar-nav .nav-item').filter({ hasText: 'Tài khoản của tôi' }).click();
        await expect(page).toHaveURL('/accounts');

        // 3. Create Account
        await page.locator('.add-acc-btn').click();
        await page.fill('input[placeholder="Vd: ATM, Thẻ tín dụng..."]', 'Ví Test Automation');
        await page.fill('input[placeholder="0"]', '10000000');
        await page.click('button:has-text("Lưu")');

        // Màn hình hiển thị ví mới
        await expect(page.locator('.accounts-list')).toContainText('Ví Test Automation');

        // 4. Quick Add Transaction from Account card
        const quickAddBtn = page.locator('.acc-item', { hasText: 'Ví Test Automation' }).locator('.quick-add-btn');
        await quickAddBtn.click();
        await expect(page).toHaveURL('/transactions');

        // 5. Fill transaction form (Thêm chi phí 1 triệu)
        await expect(page.locator('h2:has-text("Thêm giao dịch mới")')).toBeVisible();
        await page.fill('input[placeholder="0"]', '1000000');
        // We are selecting 'Ăn uống' directly by text value since categories are mapped
        await page.locator('select.input-field').nth(0).selectOption({ label: 'Ăn uống' });
        await page.fill('input[placeholder="Chi tiết giao dịch"]', 'Đi ăn nhà hàng E2E');
        await page.click('button:has-text("Lưu giao dịch")');

        // Lịch sử hiện ra
        await expect(page.locator('.tx-list-item').first()).toContainText('Ăn uống');
        await expect(page.locator('.tx-amount.expense').first()).toContainText('-1.000.000\xa0₫');

        // 6. Check Dashboard Balances update
        await page.locator('.sidebar-nav .nav-item').filter({ hasText: 'Tổng quan' }).click();
        await expect(page).toHaveURL('/');
        const balanceText = await page.locator('.balance-card h3').textContent();
        expect(balanceText).toContain('₫');

        // 7. Sidebar Filter Navigation
        const subNavItem = page.locator('.sub-nav-item', { hasText: 'Ví Test Automation' }).first();
        await subNavItem.click();
        await expect(page).toHaveURL('/transactions');
        await expect(page.locator('.page-header select').first()).not.toHaveValue('all');
    });
});
