import { env } from './env.config.js';

export const logger = {
  debug(message, context = {}) {
    if (env.nodeEnv !== 'production') {
      console.debug(message, context);
    }
  },

  info(message, context = {}) {
    console.info(message, context);
  },

  warn(message, context = {}) {
    console.warn(message, context);
  },

  error(message, context = {}) {
    console.error(message, context);
  },
};
