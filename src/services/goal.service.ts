import api from "./auth.service";

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  targetDate?: string | null;
  color?: string | null;
  icon?: string | null;
  status: "IN_PROGRESS" | "COMPLETED";
  createdAt: string;
  updatedAt: string;
}

export const goalService = {
  async getAll(): Promise<Goal[]> {
    const { data: response } = await api.get("/goals");
    return response.success ? response.data : [];
  },

  async create(data: {
    name: string;
    targetAmount: number;
    targetDate?: string;
    color?: string;
    icon?: string;
  }): Promise<Goal> {
    const { data: response } = await api.post("/goals", data);
    return response.data;
  },

  async contribute(
    id: string,
    amount: number,
    description?: string
  ): Promise<Goal> {
    const { data: response } = await api.post(`/goals/${id}/contribute`, {
      amount,
      description,
    });
    return response.data;
  },

  async withdraw(
    id: string,
    amount: number,
    description?: string
  ): Promise<Goal> {
    const { data: response } = await api.post(`/goals/${id}/withdraw`, {
      amount,
      description,
    });
    return response.data;
  },

  async delete(id: string, returnFunds: boolean = true): Promise<void> {
    await api.delete(`/goals/${id}`, { data: { returnFunds } });
  },
};
