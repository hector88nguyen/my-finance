import React from 'react';
import CurrencyInputField from 'react-currency-input-field';

export default function CurrencyInput({ value, onChange, className, placeholder, required }) {
    return (
        <CurrencyInputField
            className={className}
            placeholder={placeholder}
            value={value === 0 ? '0' : value}
            onValueChange={(val) => {
                onChange(val ? Number(val) : '');
            }}
            decimalsLimit={0}
            groupSeparator=","
            required={required}
        />
    );
}
