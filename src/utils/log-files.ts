import fs from 'fs/promises';
import pino from 'pino';

export const logger = pino({
    timestamp: () => `,"time":"${new Date().toLocaleString("ru-RU")}"`,
    base: undefined,
    transport: {
      targets: [
        {
          level: 'info',
          target: 'pino/file',
          options: { destination: 'logs/log.txt', append: true }
        },
        {
          level: 'error',
          target: 'pino/file',
          options: { destination: 'logs/error.txt', append: true }
        },
      ]
    }
  });
