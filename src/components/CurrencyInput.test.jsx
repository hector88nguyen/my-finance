import React, { useState } from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CurrencyInput from './CurrencyInput';

const TestWrapper = () => {
    const [val, setVal] = useState('');
    return (
        <div>
            <span data-testid="output">{val === '' ? 'EMPTY' : val}</span>
            <CurrencyInput value={val} onChange={setVal} placeholder="test-input" />
        </div>
    );
};

describe('Giai đoạn 2: Integration Test Component', () => {
    it('TC-I01: CurrencyInput cho phép nhập số tách phẩy hàng ngàn và emit primitive Number', () => {
        render(<TestWrapper />);
        const input = screen.getByPlaceholderText('test-input');
        const output = screen.getByTestId('output');

        expect(output.textContent).toBe('EMPTY');

        // Simulate typing 1234567
        fireEvent.change(input, { target: { value: '1234567' } });

        // Output emits clean number to parent state
        expect(output.textContent).toBe('1234567');

        // Component input formats it
        expect(input.value).toBe('1,234,567');

        // react-currency-input-field ignores letters internally in a real browser event flow, 
        // but manually firing change triggers DOM simulation. 
        fireEvent.change(input, { target: { value: '1,234,567abc' } });
        expect(input.value.indexOf('abc') === -1).toBe(true);
    });
});
