import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'sonner';

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
  (error) => {
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    const status = error.response?.status;

    if (status !== 401) {
      toast.error(message);
    }

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
