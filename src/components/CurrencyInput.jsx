import React from 'react';
import CurrencyInputField from 'react-currency-input-field';

export default function CurrencyInput({ value, onChange, className, placeholder, required }) {
    return (
        <CurrencyInputField
            className={className}
            placeholder={placeholder}
            value={value === '' || value === null || value === undefined ? '' : String(value)}
            onValueChange={(val) => {
                onChange(val ? Number(val) : '');
            }}
            decimalsLimit={0}
            groupSeparator="."
            decimalSeparator=","
            required={required}
            inputMode="decimal"
            autoComplete="off"
            name="amount"
        />
    );
}
