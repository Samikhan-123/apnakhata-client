import { toast } from 'sonner';
import { logger } from './logger';

const technicalKeywords = [
  'Prisma', 'database', 'table', 'relation', 'public.', 
  'invocation', 'constraint', 'unique', 'foreign key',
  'select', 'where', 'findUnique', 'findMany', 'create', 'update', 'delete'
];

/**
 * Sanitizes error messages to prevent sensitive database/server internals from leaking to the UI.
 */
export const sanitizeErrorMessage = (message: string): string => {
  if (!message) return 'An unexpected error occurred';
  
  const isTechnical = technicalKeywords.some(keyword => 
    message.toLowerCase().includes(keyword.toLowerCase())
  );

  if (isTechnical) {
    return 'Something went wrong on our end. Please try again later.';
  }

  return message;
};

/**
 * Global Error Handler (Client-side)
 * Centralizes toast notifications, sanitization, and logging.
 */
export const handleApiError = (error: any, options: { silent?: boolean; customMessage?: string } = {}) => {
  const status = error.response?.status;
  let message = error.response?.data?.message || error.message || 'An unexpected error occurred';
  
  message = sanitizeErrorMessage(message);
  const displayMessage = options.customMessage ? `${options.customMessage}: ${message}` : message;

  // We don't toast for:
  // 1. 401s (Auth context handles redirects)
  // 2. Offline state (Banner provides the status)
  const isOffline = typeof window !== 'undefined' && !window.navigator.onLine;

  if (status !== 401 && !isOffline && !options.silent) {
    toast.error(displayMessage);
    logger.error(displayMessage, error);
  } else {
    // Even if silent or offline, we log it for debugging
    logger.debug(`API Error (Silent: ${options.silent}, Offline: ${isOffline})`, { message, status, error });
  }

  return { message, status, error };
};
