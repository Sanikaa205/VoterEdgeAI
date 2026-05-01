/**
 * Logger Utility
 * Centralized logging with environment-aware output
 * In production, logs are suppressed to keep console clean
 */

const isDevelopment = import.meta.env.DEV;

export const logger = {
  error: (context, error) => {
    if (isDevelopment) {
      console.error(`[${context}]`, error);
    }
    // In production, errors could be sent to a logging service
  },

  warn: (context, message) => {
    if (isDevelopment) {
      console.warn(`[${context}]`, message);
    }
  },

  info: (context, message) => {
    if (isDevelopment) {
      console.info(`[${context}]`, message);
    }
  },

  debug: (context, message) => {
    if (isDevelopment) {
      console.debug(`[${context}]`, message);
    }
  },
};

export default logger;
