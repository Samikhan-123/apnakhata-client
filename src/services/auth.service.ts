import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import * as Sentry from "@sentry/nextjs";
import { db, offlineService } from './offline.service';
import { handleApiError } from '@/lib/error-handler';
import { logger } from '@/lib/logger';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});


export const authService = {
  async login(credentials: any) {
    const { data: response } = await api.post('/auth/login', credentials);
    if (response.success && response.token) {
      Cookies.set('token', response.token, { expires: 7, secure: true, sameSite: 'strict', path: '/' });
      Cookies.set('isVerified', response.user.isVerified ? 'true' : 'false', { expires: 7, secure: true, sameSite: 'strict', path: '/' });
      Cookies.set('user', JSON.stringify(response.user), { expires: 7, secure: true, sameSite: 'strict', path: '/' });
    }
    return response;
  },

  async googleLogin(idToken: string) {
    const { data: response } = await api.post('/auth/google', { idToken });
    if (response.success && response.token) {
      Cookies.set('token', response.token, { expires: 7, secure: true, sameSite: 'strict', path: '/' });
      Cookies.set('isVerified', response.user.isVerified ? 'true' : 'false', { expires: 7, secure: true, sameSite: 'strict', path: '/' });
      Cookies.set('user', JSON.stringify(response.user), { expires: 7, secure: true, sameSite: 'strict', path: '/' });
    }
    return response;
  },

  async register(userData: any) {
    const { data: response } = await api.post('/auth/register', userData);
    if (response.success && response.token) {
      Cookies.set('token', response.token, { expires: 7, secure: true, sameSite: 'strict', path: '/' });
      Cookies.set('isVerified', 'false', { expires: 7, secure: true, sameSite: 'strict', path: '/' });
      Cookies.set('user', JSON.stringify(response.user), { expires: 7, secure: true, sameSite: 'strict', path: '/' });
    }
    return response;
  },

  async verifyEmail(email: string, otp: string) {
    const { data: response } = await api.post('/auth/verify-email', { email, otp });
    if (response.success && response.token) {
      Cookies.set('token', response.token, { expires: 7, secure: true, sameSite: 'strict', path: '/' });
      Cookies.set('isVerified', 'true', { expires: 7, secure: true, sameSite: 'strict', path: '/' });
      Cookies.set('user', JSON.stringify(response.user), { expires: 7, secure: true, sameSite: 'strict', path: '/' });
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

  logout() {
    Cookies.remove('token', { path: '/' });
    Cookies.remove('isVerified', { path: '/' });
    Cookies.remove('user', { path: '/' });
  },

  getCurrentUser() {
    if (!Cookies.get('token')) {
      this.logout();
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

api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
        description: `Your ${error.config.method?.toUpperCase()} request is pending.`,
        duration: 5000
      });
      
      return Promise.resolve({ data: { success: true, offline: true } });
    }
    // -----------------------

    // Use Global Error Handler
    handleApiError(error);

    if (status === 401) {
      authService.logout();
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
