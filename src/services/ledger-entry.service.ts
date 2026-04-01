import api from './auth.service';

export const ledgerEntryService = {
  async create(data: any) {
    const { data: response } = await api.post('/ledger-entries', data);
    return response.data;
  },

  async getAll(params?: any) {
    const { data: response } = await api.get('/ledger-entries', { params });
    // return full object to include pagination metadata
    return response.success ? { data: response.data, pagination: response.pagination } : { data: [], pagination: {} };
  },

  async delete(id: string) {
    const { data: response } = await api.delete(`/ledger-entries/${id}`);
    return response.data;
  },

  async update(id: string, data: any) {
    const { data: response } = await api.patch(`/ledger-entries/${id}`, data);
    return response.data;
  },

  async getOverview(params?: any) {
    const { data: response } = await api.get('/ledger-entries/overview', { params }); 
    return response.success ? response.data : null;
  },

  async getStats(params?: any) {
    const { data: response } = await api.get('/ledger-entries/stats', { params }); 
    return response.success ? response.data : null;
  },

  async downloadCSV(filters: any = {}) {
    const response = await api.get('/ledger-entries/export', {
      params: filters,
      responseType: 'blob'
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ledger_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
};

export default ledgerEntryService;
