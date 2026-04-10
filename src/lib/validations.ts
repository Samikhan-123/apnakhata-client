import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
  baseCurrency: z.string().min(1, 'Base currency is required'),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

// --- Transactional Schemas ---

export const ledgerEntrySchema = z.object({
  amount: z.string().min(1, 'Value required').refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Must be positive'),
  description: z.string().min(3, 'Minimum 3 characters').max(50, 'Too long'),
  type: z.enum(['INCOME', 'EXPENSE']),
  categoryId: z.string().optional().nullable(),
  date: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.type === 'EXPENSE' && !data.categoryId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Required",
      path: ['categoryId']
    });
  }
});

export const categorySchema = z.object({
  name: z.string().min(2, 'Minimum 2 characters').max(50, 'Too long'),
  icon: z.string().min(1, 'Icon required'),
});

export const budgetSchema = z.object({
  categoryId: z.string().min(1, 'Category required'),
  limit: z.string().min(1, 'Budget limit is required').refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Must be positive'),
});

export const recurringTaskSchema = z.object({
  description: z.string().min(3, 'Minimum 3 characters').max(100, 'Too long'),
  amount: z.string().min(1, 'Value required').refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Must be positive'),
  type: z.enum(['INCOME', 'EXPENSE']),
  frequency: z.enum(['WEEKLY', 'MONTHLY', 'YEARLY']),
  categoryId: z.string().optional().nullable(),
  nextExecution: z.string().min(1, 'Start date is required'),
});

export type LedgerEntryInput = z.infer<typeof ledgerEntrySchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type BudgetInput = z.infer<typeof budgetSchema>;
export type RecurringTaskInput = z.infer<typeof recurringTaskSchema>;
