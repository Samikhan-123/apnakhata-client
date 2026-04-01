import api from './auth.service';

export const categoryService = {
  async getAll() {
    const { data: response } = await api.get('/categories');
    return response.success ? response.data : [];
  },

  async create(data: { name: string; icon?: string }) {
    const { data: response } = await api.post('/categories', data);
    return response.data;
  },

  async update(id: string, data: { name: string; icon?: string }) {
    const { data: response } = await api.patch(`/categories/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const { data: response } = await api.delete(`/categories/${id}`);
    return response.data;
  }
};
