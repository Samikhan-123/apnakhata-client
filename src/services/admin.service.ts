import api from './auth.service';

export const adminService = {
  getStats: async () => {
    const { data: response } = await api.get('/admin/stats');
    return response;
  },

  getUsers: async (page: number = 1, limit: number = 10) => {
    const { data } = await api.get(`/admin/users?page=${page}&limit=${limit}`);
    return data;
  },

  updateUser: async (id: string, data: { role?: string, isVerified?: boolean, isActive?: boolean }) => {
    const { data: response } = await api.patch(`/admin/users/${id}`, data);
    return response;
  },

  batchUpdateUsers: async (ids: string[], data: { role?: string, isVerified?: boolean, isActive?: boolean }) => {
    const { data: response } = await api.patch('/admin/users/batch', { ids, data });
    return response;
  },

  getUserDetail: async (id: string) => {
    const { data: response } = await api.get(`/admin/users/${id}`);
    return response;
  },

  getAuditLogs: async (page: number = 1, limit: number = 15, filters: any = {}) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value as string);
    });

    const { data } = await api.get(`/admin/audit-logs?${params.toString()}`);
    return data;
  },

  getFinancialStats: async () => {
    const { data } = await api.get('/admin/financial-stats');
    return data;
  },

  getSettings: async () => {
    const { data } = await api.get('/admin/settings');
    return data;
  },

  updateSettings: async (data: any) => {
    const { data: response } = await api.patch('/admin/settings', data);
    return response;
  },
  
  scheduleUserDeletion: async (id: string) => {
    const { data: response } = await api.patch(`/admin/users/${id}/schedule-deletion`);
    return response;
  },

  cancelUserDeletion: async (id: string) => {
    const { data: response } = await api.patch(`/admin/users/${id}/cancel-deletion`);
    return response;
  }
};
