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
  const backendErrors = error.response?.data?.errors;
  const config = error.config;
  
  // Try to get a specific validation message if available
  let message = error.response?.data?.message;
  
  if (Array.isArray(backendErrors) && backendErrors.length > 0) {
    const firstErr = backendErrors[0];
    message = `${firstErr.path.join('.')}: ${firstErr.message}`;
  }
  
  message = message || error.message || 'An unexpected error occurred';
  message = sanitizeErrorMessage(message);
  
  const displayMessage = options.customMessage ? `${options.customMessage}: ${message}` : message;

  // Final check for silence: either passed via options or via axios config
  const shouldBeSilent = options.silent || (config as any)?.silent || false;
  const isOffline = typeof window !== 'undefined' && !window.navigator.onLine;

  if (status !== 401 && !isOffline && !shouldBeSilent) {
    // Deduplicate by creating a light fingerprint of the message
    const toastId = `api-error-${message.slice(0, 30)}`;
    toast.error(displayMessage, { id: toastId });
    logger.error(displayMessage, error);
  } else {
    logger.debug(`API Error (Silent: ${shouldBeSilent}, Offline: ${isOffline})`, { message, status, error });
  }

  return { message, status, error };
};
