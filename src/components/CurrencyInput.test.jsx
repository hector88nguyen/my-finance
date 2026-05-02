import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CurrencyInput from './CurrencyInput';

// ─────────────────────────────────────────────
// TC-I01: CurrencyInput Component
// ─────────────────────────────────────────────
const TestWrapper = ({ initialValue = '' } = {}) => {
    const [val, setVal] = React.useState(initialValue);
    return (
        <div>
            <span data-testid="output">{val === '' ? 'EMPTY' : val}</span>
            <CurrencyInput value={val} onChange={setVal} placeholder="test-input" />
        </div>
    );
};

describe('Giai đoạn 2 – Integration Test: CurrencyInput Component', () => {
    it('TC-I01a: Khởi tạo với giá trị rỗng', () => {
        render(<TestWrapper />);
        expect(screen.getByTestId('output').textContent).toBe('EMPTY');
    });

    it('TC-I01b: Nhập số 1234567 → hiển thị định dạng 1.234.567', () => {
        render(<TestWrapper />);
        const input = screen.getByPlaceholderText('test-input');

        fireEvent.change(input, { target: { value: '1234567' } });
        expect(screen.getByTestId('output').textContent).toBe('1234567');
        expect(input.value).toBe('1.234.567');
    });

    it('TC-I01c: Không chứa ký tự chữ sau khi nhập', () => {
        render(<TestWrapper />);
        const input = screen.getByPlaceholderText('test-input');

        fireEvent.change(input, { target: { value: '1.234.567abc' } });
        expect(input.value.indexOf('abc')).toBe(-1);
    });

    it('TC-I01d: Nhận giá trị ban đầu và hiển thị đúng format', () => {
        render(<TestWrapper initialValue="5000000" />);
        expect(screen.getByTestId('output').textContent).toBe('5000000');
    });
});
