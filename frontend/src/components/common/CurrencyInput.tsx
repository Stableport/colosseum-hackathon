
import React, { useState } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface CurrencyInputProps {
  onValueChange?: (value: string, currency: string) => void;
  initialValue?: string;
  initialCurrency?: string;
  label?: string;
  availableCurrencies?: Array<{ code: string, name: string }>;
  readOnly?: boolean;
}

const CurrencyInput = ({ 
  onValueChange, 
  initialValue = '', 
  initialCurrency = 'NGN',
  label = 'Amount',
  availableCurrencies = [
    { code: 'NGN', name: 'Nigerian Naira' },
    { code: 'KES', name: 'Kenyan Shilling' },
    { code: 'GHS', name: 'Ghanaian Cedi' },
    { code: 'AED', name: 'UAE Dirham' }
  ],
  readOnly = false
}: CurrencyInputProps) => {
  const [value, setValue] = useState(initialValue);
  const [currency, setCurrency] = useState(initialCurrency);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and decimal point
    const inputVal = e.target.value.replace(/[^0-9.]/g, '');
    setValue(inputVal);
    onValueChange?.(inputVal, currency);
  };

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency);
    onValueChange?.(value, newCurrency);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <Select value={currency} onValueChange={handleCurrencyChange} disabled={readOnly}>
          <SelectTrigger className="w-24 border-0 shadow-none px-0 h-auto">
            <SelectValue placeholder="Currency" />
          </SelectTrigger>
          <SelectContent>
            {availableCurrencies.map(curr => (
              <SelectItem key={curr.code} value={curr.code}>
                {curr.code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={handleValueChange}
          className="input-amount"
          placeholder="0.00"
          readOnly={readOnly}
        />
      </div>
    </div>
  );
};

export default CurrencyInput;
