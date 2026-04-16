import { z } from 'zod';

// --- Auth Schemas ---

export const registerSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(15, 'Name must be within 15 characters')
    .regex(/^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/, 'Special icons and emojis are not allowed'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  baseCurrency: z.string().min(1, 'Base currency is required'),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

// --- Financial Schemas ---

// numeric input for better TypeScript inference with zodResolver
const numericValue = z.union([z.number(), z.string()])
  .transform((val) => Number(val))
  .pipe(z.number().positive('Amount must be positive').max(1000000000, 'Amount too large'));

const descriptionRestricted = z.string()
  .min(3, 'Description must be at least 3 characters')
  .max(100, 'Description must be within 100 characters')
  .regex(/^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/, 'Special icons and emojis are not allowed');

export const ledgerEntrySchema = z.object({
  amount: numericValue,
  description: descriptionRestricted,
  type: z.enum(['INCOME', 'EXPENSE']),
  categoryId: z.string().optional().nullable(),
  date: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.type === 'EXPENSE' && !data.categoryId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Category is required for expenses",
      path: ['categoryId']
    });
  }
});

export const categorySchema = z.object({
  name: z.string()
    .min(2, 'Category name must be at least 2 characters')
    .max(15, 'Category name must be within 15 characters'),
  icon: z.string().min(1, 'Icon selection is required'),
});

export const budgetSchema = z.object({
  categoryId: z.string().min(1, 'Category is required'),
  limit: numericValue,
});

export const recurringTaskSchema = z.object({
  description: descriptionRestricted,
  amount: numericValue,
  type: z.enum(['INCOME', 'EXPENSE']),
  frequency: z.enum(['WEEKLY', 'MONTHLY', 'YEARLY']),
  categoryId: z.string().optional().nullable(),
  nextExecution: z.string().min(1, 'Effective date is required'),
});

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(15, 'Name must be within 15 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.enum(['BUG', 'FEEDBACK', 'HELP', 'OTHER'] as const, {
    message: 'Please select a subject'
  }),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message too long'),
});

export type LedgerEntryInput = z.input<typeof ledgerEntrySchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type BudgetInput = z.input<typeof budgetSchema>;
export type RecurringTaskInput = z.input<typeof recurringTaskSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
