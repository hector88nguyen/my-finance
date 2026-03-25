import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

// Component con bắn lỗi để kiểm tra ErrorBoundary
const BrokenComponent = () => {
    throw new Error('Test Render Error');
};

// Component con hoạt động bình thường
const WorkingComponent = () => <div>Nội dung trang</div>;

describe('Giai đoạn 2 – Integration Test: ErrorBoundary Component', () => {
    // Tắt console.error trong test này để output clean hơn
    const originalError = console.error;
    beforeEach(() => {
        console.error = vi.fn();
    });
    afterEach(() => {
        console.error = originalError;
    });

    it('TC-I02a: Render bình thường khi component con không lỗi', () => {
        render(
            <ErrorBoundary>
                <WorkingComponent />
            </ErrorBoundary>
        );
        expect(screen.getByText('Nội dung trang')).toBeDefined();
    });

    it('TC-I02b: Bắt lỗi và hiển thị fallback UI khi component con throw Error', () => {
        render(
            <ErrorBoundary>
                <BrokenComponent />
            </ErrorBoundary>
        );
        // Fallback UI phải hiển thị thẻ heading lỗi
        expect(screen.getByText(/đã xảy ra lỗi/i)).toBeDefined();
    });

    it('TC-I02c: Fallback UI có nút "Tải lại trang"', () => {
        render(
            <ErrorBoundary>
                <BrokenComponent />
            </ErrorBoundary>
        );
        expect(screen.getByText(/tải lại trang/i)).toBeDefined();
    });
});
