import * as Sentry from "@sentry/nextjs";

const isProd = process.env.NODE_ENV === "production";

/**
 * Senior Dev Logger - Centralized logging for the client.
 * In development: Styled console logs for readability.
 * In production: Minimal console output, sends errors to Sentry.
 */
export const logger = {
  info: (message: string, data?: any) => {
    if (!isProd) {
      console.log(
        `%c[INFO] ${message}`,
        "background: #0ea5e9; color: white; padding: 2px 4px; border-radius: 2px;",
        data || "",
      );
    }
  },

  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data || "");
  },

  error: (message: string, error?: any) => {
    // We always Log to console.error for visibility in DevTools
    console.error(`[ERROR] ${message}`, error || "");

    if (isProd) {
      Sentry.captureException(error || new Error(message));
    }
  },

  debug: (message: string, data?: any) => {
    if (!isProd) {
      console.debug(`[DEBUG] ${message}`, data || "");
    }
  },
};
