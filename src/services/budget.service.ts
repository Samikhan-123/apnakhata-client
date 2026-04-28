import api from "./auth.service";

export const budgetService = {
  async getAll(month?: number, year?: number) {
    const params = { month, year };
    const { data: response } = await api.get("/budgets", { params });
    return response.success ? response.data : [];
  },

  async setBudget(data: {
    categoryId: string;
    limit: number;
    month: number;
    year: number;
  }) {
    const { data: response } = await api.post("/budgets", data);
    return response.data;
  },

  async delete(id: string) {
    const { data: response } = await api.delete(`/budgets/${id}`);
    return response.data;
  },
};
