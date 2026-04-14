'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';
import { adminService } from '../services/admin.service';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface AuthContextType {
  user: any;
  loading: boolean;
  isImpersonating: boolean;
  readOnly: boolean;
  login: (credentials: any) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  verifyEmail: (email: string, otp: string) => Promise<void>;
  resendOTP: (email: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (data: any) => Promise<void>;
  logout: () => void;
  impersonate: (userId: string) => Promise<void>;
  stopImpersonating: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Proactively check server for session
        const response = await authService.getMe();
        if (response.success && response.user) {
          setUser(response.user);
          setIsImpersonating(!!response.impersonatorId);
          setReadOnly(!!response.isReadOnly);
        }
      } catch (error) {
        // If no session, check local storage for a partial state
        const storedUser = authService.getCurrentUser();
        if (storedUser) {
          setUser(storedUser);
        }
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (credentials: any) => {
    try {
      const response = await authService.login(credentials);
      if (response.success && response.user) {
        setUser(response.user);
        router.push('/dashboard');
      }
    } catch (err: any) {
      // If unverified, redirect to verify-email
      if (err.response?.status === 403 && err.response?.data?.unverified) {
        // Ensure user is set in context if backend returned it (even if unverified)
        if (err.response?.data?.user) {
          setUser(err.response.data.user);
        }
        router.push(`/verify-email?email=${encodeURIComponent(credentials.email)}`);
      }
      throw err;
    }
  };

  const loginWithGoogle = async (idToken: string) => {
    try {
      const response = await authService.googleLogin(idToken);
      if (response.success && response.user) {
        setUser(response.user);
        router.push('/dashboard');
      }
    } catch (err: any) {
      if (err.response?.status === 403 && err.response?.data?.unverified) {
        router.push(`/verify-email?email=${encodeURIComponent(err.response.data.user?.email || '')}`);
      }
      throw err;
    }
  };

  const register = async (userData: any) => {
    const response = await authService.register(userData);
    if (response.success && response.user) {
       setUser(response.user);
       // Registration successful, go verify
       router.push(`/verify-email?email=${encodeURIComponent(userData.email)}`);
    }
  };

  const verifyEmail = async (email: string, otp: string) => {
    const response = await authService.verifyEmail(email, otp);
    if (response.success && response.user) {
      setUser(response.user);
      router.push('/dashboard');
    }
  };

  const resendOTP = async (email: string) => {
    await authService.resendOTP(email);
  };

  const forgotPassword = async (email: string) => {
    await authService.forgotPassword(email);
  };

  const resetPassword = async (data: any) => {
    await authService.resetPassword(data);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setIsImpersonating(false);
    setReadOnly(false);
    router.replace('/login');
  };

  const impersonate = async (userId: string) => {
    try {
      const response = await adminService.impersonateUser(userId);
      if (response.success) {
        // Backend sets the token cookie. We just need to refresh local state.
        setUser(response.data.user);
        setIsImpersonating(true);
        setReadOnly(true);
        toast.success(`Impersonation active: viewing as ${response.data.user.name}`);
        router.push('/dashboard');
      }
    } catch (error) {
       // Error handled by global interceptor
    }
  };

  const stopImpersonating = async () => {
    try {
      const response = await adminService.stopImpersonation();
      if (response.success) {
        setUser(response.data.user);
        setIsImpersonating(false);
        setReadOnly(false);
        toast.success("Staff session restored.");
        router.push('/admin/users');
      }
    } catch (error) {
       // Error handled by global interceptor
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isImpersonating,
      readOnly,
      login, 
      loginWithGoogle,
      register, 
      verifyEmail, 
      resendOTP, 
      forgotPassword, 
      resetPassword, 
      logout,
      impersonate,
      stopImpersonating
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
