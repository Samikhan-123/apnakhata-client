import api from './auth.service';

export const adminService = {
  getStats: async () => {
    const { data: response } = await api.get('/admin/stats');
    return response;
  },

  getUsers: async (page: number = 1, limit: number = 10, filters: any = {}) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value != null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const { data } = await api.get(`/admin/users?${params.toString()}`);
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
  },

  impersonateUser: async (id: string) => {
    const { data: response } = await api.post(`/admin/users/${id}/impersonate`);
    return response;
  },

  stopImpersonation: async () => {
    const { data: response } = await api.post('/admin/impersonate/stop');
    return response;
  },

  getSystemStatus: async () => {
    const { data } = await api.get('/system/status');
    return data;
  },

  runMaintenance: async () => {
    const { data } = await api.post('/admin/maintenance');
    return data;
  }
};
