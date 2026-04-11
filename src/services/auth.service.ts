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


export const authService = {
  async login(credentials: any) {
    const { data: response } = await api.post('/auth/login', credentials);
    if (response.success) {
      Cookies.set('isVerified', response.user.isVerified ? 'true' : 'false', { expires: 30, secure: true, sameSite: 'strict', path: '/' });
      Cookies.set('user', JSON.stringify(response.user), { expires: 30, secure: true, sameSite: 'strict', path: '/' });
      Cookies.set('isLoggedIn', 'true', { expires: 30, secure: true, sameSite: 'strict', path: '/' });
    }
    return response;
  },

  async googleLogin(idToken: string) {
    const { data: response } = await api.post('/auth/google', { idToken });
    if (response.success) {
      Cookies.set('isVerified', response.user.isVerified ? 'true' : 'false', { expires: 30, secure: true, sameSite: 'strict', path: '/' });
      Cookies.set('user', JSON.stringify(response.user), { expires: 30, secure: true, sameSite: 'strict', path: '/' });
      Cookies.set('isLoggedIn', 'true', { expires: 30, secure: true, sameSite: 'strict', path: '/' });
    }
    return response;
  },

  async register(userData: any) {
    const { data: response } = await api.post('/auth/register', userData);
    if (response.success) {
      Cookies.set('isVerified', 'false', { expires: 30, secure: true, sameSite: 'strict', path: '/' });
      Cookies.set('user', JSON.stringify(response.user), { expires: 30, secure: true, sameSite: 'strict', path: '/' });
      Cookies.set('isLoggedIn', 'true', { expires: 30, secure: true, sameSite: 'strict', path: '/' });
    }
    return response;
  },

  async verifyEmail(email: string, otp: string) {
    const { data: response } = await api.post('/auth/verify-email', { email, otp });
    if (response.success) {
      Cookies.set('isVerified', 'true', { expires: 30, secure: true, sameSite: 'strict', path: '/' });
      Cookies.set('user', JSON.stringify(response.user), { expires: 30, secure: true, sameSite: 'strict', path: '/' });
    }
    return response;
  },

  async resendOTP(email: string) {
    const { data: response } = await api.post('/auth/resend-otp', { email });
    return response;
  },

  async forgotPassword(email: string) {
    const { data: response } = await api.post('/auth/forgot-password', { email });
    return response;
  },

  async resetPassword(data: any) {
    const { data: response } = await api.post('/auth/reset-password', data);
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

    if (typeof window !== 'undefined') {
       window.location.href = '/login';
    }
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

    // Use Global Error Handler
    handleApiError(error);

    if (status === 401) {
      // Use direct cleanup to avoid infinite loop
      Cookies.remove('isVerified', { path: '/' });
      Cookies.remove('user', { path: '/' });
      Cookies.remove('isLoggedIn', { path: '/' });
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
