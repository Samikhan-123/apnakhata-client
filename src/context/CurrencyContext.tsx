'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface CurrencyContextType {
  currency: string;
  setCurrency: (currency: string) => void;
  formatCurrency: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const currencies = [
  { code: 'PKR', symbol: 'Rs', name: 'Pakistani Rupee' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'SAR', symbol: 'SR', name: 'Saudi Riyal' },
  { code: 'AED', symbol: 'DH', name: 'UAE Dirham' },
];

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [currency, setCurrency] = useState('PKR');

  useEffect(() => {
    if (user?.baseCurrency) {
      setCurrency(user.baseCurrency);
    }
  }, [user]);

  const formatCurrency = (amount: number) => {
    const selectedCurrency = currencies.find(c => c.code === currency) || currencies[0];
    
    // Custom formatting for Asian currencies often uses "Rs" prefix/suffix
    if (currency === 'PKR') {
      return `Rs ${amount.toLocaleString('en-PK', { minimumFractionDigits: 0 })}`;
    }
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
