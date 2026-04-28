"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

import { authService } from "../services/auth.service";
import { toast } from "sonner";

interface CurrencyContextType {
  currency: string;
  setCurrency: (currency: string) => Promise<void>;
  formatCurrency: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined,
);

export const currencies = [
  { code: "PKR", symbol: "Rs", name: "Pakistani Rupee" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "SAR", symbol: "SR", name: "Saudi Riyal" },
  { code: "AED", symbol: "DH", name: "UAE Dirham" },
];

export const CurrencyProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user, updateUser, readOnly } = useAuth();
  const [currency, setCurrencyState] = useState("PKR");

  useEffect(() => {
    if (user?.baseCurrency) {
      setCurrencyState(user.baseCurrency);
    }
  }, [user]);

  const setCurrency = async (newCurrency: string) => {
    if (newCurrency === currency) return;

    if (readOnly) {
      toast.error("Diagnostic Session: Mutation actions are disabled.");
      return;
    }

    const previousCurrency = currency;

    // 1. Update UI immediately (Optimistic)
    setCurrencyState(newCurrency);

    try {
      // 2. Persist to DB
      const response = await authService.updatePreferences({
        baseCurrency: newCurrency,
      });

      if (response.success && response.user) {
        // 3. Update global AuthContext to keep user object in sync
        updateUser(response.user);
        toast.success(`Currency changed to ${newCurrency}`);
      } else {
        throw new Error("Failed to update preferences");
      }
    } catch (error) {
      // 4. Rollback on failure
      setCurrencyState(previousCurrency);
      toast.error("Failed to save currency preference");
    }
  };

  const formatCurrency = (amount: number) => {
    const selectedCurrency =
      currencies.find((c) => c.code === currency) || currencies[0];

    // Custom formatting for Asian currencies often uses "Rs" prefix/suffix
    if (currency === "PKR") {
      return `Rs ${amount.toLocaleString("en-PK", { minimumFractionDigits: 0 })}`;
    }

    return new Intl.NumberFormat("en-US", {
      style: "currency",
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
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};
