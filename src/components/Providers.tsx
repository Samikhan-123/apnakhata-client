'use client';

import React from 'react';
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/context/AuthContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { Toaster } from "sonner";
import { GoogleOAuthProvider } from '@react-oauth/google';

import { NetworkProvider } from "@/context/NetworkContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
        <NetworkProvider>
          <AuthProvider>
            <CurrencyProvider>
              {children}
              <Toaster position="bottom-right" expand={false} richColors closeButton />
            </CurrencyProvider>
          </AuthProvider>
        </NetworkProvider>
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
}
