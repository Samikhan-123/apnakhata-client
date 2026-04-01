import api from './auth.service';

export const recurringService = {
  async getAll() {
    const { data: response } = await api.get('/recurring');
    return response.success ? response.data : [];
  },

  async create(data: {
    categoryId?: string;
    amount: number;
    description: string;
    type: 'INCOME' | 'EXPENSE';
    frequency: 'TEN_SECONDS' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
    nextExecution?: string;
  }) {
    const { data: response } = await api.post('/recurring', data);
    return response.data;
  },

  async delete(id: string) {
    const { data: response } = await api.delete(`/recurring/${id}`);
    return response.data;
  },

  async processManual() {
    const { data: response } = await api.post('/recurring/process-due');
    return response.data;
  }
};
