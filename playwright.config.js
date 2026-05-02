import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: 0,
    workers: 1,
    reporter: 'list',
    use: {
        baseURL: 'http://localhost:21345',
        trace: 'on-first-retry',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'iPhone 14 (iOS 16)',
            use: { ...devices['iPhone 14'] },
        },
    ],
    webServer: {
        command: 'npm run build && npm run preview -- --port 21345',
        url: 'http://localhost:21345/my-finance/',
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000,
    },
});
