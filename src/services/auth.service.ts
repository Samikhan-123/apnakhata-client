import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import * as Sentry from "@sentry/nextjs";
import { db, offlineService } from './offline.service';
import { handleApiError } from '@/lib/error-handler';
import { logger } from '@/lib/logger';

const isProduction = typeof window !== 'undefined' && 
  (window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1'));

const API_URL = isProduction ? '/api' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api');

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Crucial for cookie-based auth
});

// Helper for consistent client-side cookie options
const getCookieOptions = () => ({
  expires: 30,
  secure: typeof window !== 'undefined' && window.location.protocol === 'https:',
  sameSite: 'lax' as const,
  path: '/'
});


export const authService = {
  async login(credentials: any) {
    // Proactively clear existing session to prevent mixing unverified/old states
    await this.logout().catch(() => {});
    
    const { data: response } = await api.post('/auth/login', credentials, { silent: true } as any);
    if (response.success) {
      const options = getCookieOptions();
      Cookies.set('isVerified', response.user.isVerified ? 'true' : 'false', options);
      Cookies.set('user', JSON.stringify(response.user), options);
      Cookies.set('isLoggedIn', 'true', options);
    }
    return response;
  },

  async googleLogin(idToken: string) {
    // Proactively clear existing session
    await this.logout().catch(() => {});

    const { data: response } = await api.post('/auth/google', { idToken }, { silent: true } as any);
    if (response.success) {
      const options = getCookieOptions();
      Cookies.set('isVerified', response.user.isVerified ? 'true' : 'false', options);
      Cookies.set('user', JSON.stringify(response.user), options);
      Cookies.set('isLoggedIn', 'true', options);
    }
    return response;
  },

  async register(userData: any) {
    const clientTimestamp = new Date().toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'medium', hour12: true });
    const { data: response } = await api.post('/auth/register', { ...userData, clientTimestamp }, { silent: true } as any);
    if (response.success) {
      const options = getCookieOptions();
      Cookies.set('isVerified', 'false', options);
      Cookies.set('user', JSON.stringify(response.user), options);
      Cookies.set('isLoggedIn', 'true', options);
    }
    return response;
  },

  async verifyEmail(email: string, otp: string) {
    const { data: response } = await api.post('/auth/verify-email', { email, otp }, { silent: true } as any);
    if (response.success) {
      const options = getCookieOptions();
      Cookies.set('isVerified', 'true', options);
      Cookies.set('user', JSON.stringify(response.user), options);
    }
    return response;
  },

  async resendOTP(email: string) {
    const clientTimestamp = new Date().toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'medium', hour12: true });
    const { data: response } = await api.post('/auth/resend-otp', { email, clientTimestamp }, { silent: true } as any);
    return response;
  },

  async forgotPassword(email: string) {
    const clientTimestamp = new Date().toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'medium', hour12: true });
    const { data: response } = await api.post('/auth/forgot-password', { email, clientTimestamp }, { silent: true } as any);
    return response;
  },

  async resetPassword(data: any) {
    const clientTimestamp = new Date().toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'medium', hour12: true });
    const { data: response } = await api.post('/auth/reset-password', { ...data, clientTimestamp }, { silent: true } as any);
    return response;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // console.error('Logout failed on server', error);
    }
    Cookies.remove('isVerified', { path: '/' });
    Cookies.remove('user', { path: '/' });
    Cookies.remove('isLoggedIn', { path: '/' });
    
    // Also remove legacy token if exists from previous system
    Cookies.remove('token', { path: '/' });

  },

  getCurrentUser() {
    if (!Cookies.get('isLoggedIn')) {
      return null;
    }
    const user = Cookies.get('user');
    return user ? JSON.parse(user) : null;
  },

  async getMe() {
    const { data: response } = await api.get('/auth/me');
    return response;
  },

  async requestDeletion() {
    const { data: response } = await api.post('/auth/request-deletion');
    if (response.success) {
      Cookies.remove('isVerified', { path: '/' });
      Cookies.remove('user', { path: '/' });
      Cookies.remove('isLoggedIn', { path: '/' });
    }
    return response;
  },
  
  async updatePreferences(data: { baseCurrency: string }) {
    const { data: response } = await api.patch('/auth/preferences', data);
    if (response.success && response.user) {
      const options = getCookieOptions();
      Cookies.set('user', JSON.stringify(response.user), options);
    }
    return response;
  }
};

// Remove the request interceptor that adds Authorization header
// Cookies with withCredentials: true will handle this automatically

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;

    // --- Offline Logic ---
    const isOffline = !window.navigator.onLine || !error.response;
    const isMutation = ['post', 'patch', 'delete'].includes(error.config?.method?.toLowerCase() || '');
    const isSyncRequest = error.config?._isSyncRequest;

    if (isOffline && isMutation && !isSyncRequest) {
      await offlineService.addToQueue({
        url: error.config.url,
        method: error.config.method,
        data: JSON.parse(error.config.data || '{}'),
        headers: error.config.headers
      });
      toast.info('Saved offline. Changes will sync when reconnected.', {
        description: `Your request is pending.`,
        duration: 5000
      });

      return Promise.resolve({ data: { success: true, offline: true } });
    }
    // -----------------------

    // Use Global Error Handler (Passes config to check for silence)
    handleApiError(error);

    if (status === 401) {
      const message = error.response?.data?.message || '';
      if (message.includes('deactivated')) {
        toast.error('Account Deactivated', {
          description: 'Your account has been deactivated. Please contact support.',
          duration: 6000
        });
      }

      // Use direct cleanup to avoid infinite loop
      Cookies.remove('isVerified', { path: '/' });
      Cookies.remove('user', { path: '/' });
      Cookies.remove('isLoggedIn', { path: '/' });
      
      const publicPaths = ['/', '/login', '/register', '/verify-email', '/forgot-password', '/reset-password'];
      const isPublicPath = typeof window !== 'undefined' && publicPaths.includes(window.location.pathname);

      if (typeof window !== 'undefined' && !isPublicPath) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
