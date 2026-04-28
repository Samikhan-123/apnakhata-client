import api from "./auth.service";
import { LedgerEntry, OverviewStats, PaginatedResult } from "../types";

export const ledgerEntryService = {
  async create(data: Partial<LedgerEntry>): Promise<LedgerEntry> {
    const { data: response } = await api.post("/ledger-entries", data);
    return response.data;
  },

  async getAll(params?: Record<string, string | number>): Promise<PaginatedResult<LedgerEntry>> {
    const { data: response } = await api.get("/ledger-entries", { params });
    // return full object to include pagination metadata
    return response.success
      ? { data: response.data, pagination: response.pagination }
      : { data: [], pagination: { total: 0, page: 1, limit: 20, totalPages: 0 } };
  },

  async delete(id: string): Promise<boolean> {
    const { data: response } = await api.delete(`/ledger-entries/${id}`);
    return response.success;
  },

  async update(id: string, data: Partial<LedgerEntry>): Promise<LedgerEntry> {
    const { data: response } = await api.patch(`/ledger-entries/${id}`, data);
    return response.data;
  },

  async getOverview(params?: Record<string, string | number>): Promise<OverviewStats | null> {
    const { data: response } = await api.get("/ledger-entries/overview", {
      params,
    });
    return response.success ? response.data : null;
  },

  async getStats(params?: Record<string, string | number>) {
    const { data: response } = await api.get("/ledger-entries/stats", {
      params,
    });
    return response.success ? response.data : null;
  },

  async downloadCSV(filters: Record<string, string | number> = {}) {
    const response = await api.get("/ledger-entries/export", {
      params: filters,
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `ledger_export_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  async getExportData(params?: Record<string, string | number>): Promise<LedgerEntry[]> {
    const { data: response } = await api.get("/ledger-entries/export", {
      params: { ...params, format: "json" },
    });
    return response.success ? response.data : [];
  },
};

export default ledgerEntryService;
