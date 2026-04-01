'use client';

import React from 'react';
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/context/AuthContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { Toaster } from "sonner";
import { GoogleOAuthProvider } from '@react-oauth/google';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <GoogleOAuthProvider clientId="1086444278848-e3vgdseo2n8n73272kp9v5998afi3prj.apps.googleusercontent.com">
        <AuthProvider>
          <CurrencyProvider>
            {children}
            <Toaster position="bottom-right" expand={false} richColors closeButton />
          </CurrencyProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
}
