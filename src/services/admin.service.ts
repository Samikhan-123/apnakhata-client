import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = Cookies.get('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const adminService = {
  getStats: async () => {
    const response = await axios.get(`${API_URL}/admin/stats`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  getUsers: async () => {
    const response = await axios.get(`${API_URL}/admin/users`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  updateUser: async (id: string, data: { role?: string, isVerified?: boolean }) => {
    const response = await axios.patch(`${API_URL}/admin/users/${id}`, data, {
      headers: getAuthHeader(),
    });
    return response.data;
  }
};
