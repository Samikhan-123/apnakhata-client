export type UserRole = "ADMIN" | "MODERATOR" | "USER";
export type LedgerEntryType = "INCOME" | "EXPENSE" | "TRANSFER";
export type Frequency =
  | "TEN_SECONDS"
  | "DAILY"
  | "WEEKLY"
  | "MONTHLY"
  | "YEARLY";

export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: UserRole;
  baseCurrency: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastActive: string;
  lastLogin: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string | null;
  userId: string | null;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LedgerEntry {
  id: string;
  amount: string | number;
  description: string;
  date: string;
  type: LedgerEntryType;
  userId: string;
  categoryId: string | null;
  category?: Category;
  receiptUrl: string | null;
  receiptPublicId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RecurringEntry {
  id: string;
  amount: string | number;
  description: string;
  type: LedgerEntryType;
  frequency: Frequency;
  nextExecution: string;
  lastExecution: string | null;
  isActive: boolean;
  userId: string;
  categoryId: string | null;
  category?: Category;
  hits: number;
  lastStatus: string | null;
  lastStatusDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: string;
  limit: string | number;
  month: number;
  year: number;
  categoryId: string;
  category?: Category;
  userId: string;
}

export interface AdminLog {
  id: string;
  adminId: string | null;
  admin?: User;
  action: string;
  targetId: string | null;
  target?: User;
  details: Record<string, any> | null;
  createdAt: string;
}

export interface SystemSettings {
  id: string;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  maxEntriesLimit: number;
  updatedAt: string;
}

// Service Response DTOs
export interface OverviewStats {
  totalIncome: number;
  totalExpense: number;
  remainingBalance: number;
  totalRecords: number;
  maxEntriesLimit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
