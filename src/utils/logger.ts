import winston from 'winston';
import { join } from 'path';

const logFormat = winston.format.combine(winston.format.errors({ stack: true }), winston.format.json());
const consoleFormat = winston.format.combine(winston.format.colorize(), winston.format.simple());

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'selenium-mcp' },
  transports: [
    new winston.transports.Console({
      format: process.env.NODE_ENV === 'production' ? logFormat : consoleFormat,
    }),
    // Winston will create directories automatically in newer versions
    ...(process.env.NODE_ENV === 'production'
      ? [
          new winston.transports.File({
            filename: join(getLogsDirectory(), 'error.log'),
            level: 'error',
          }),
          new winston.transports.File({
            filename: join(getLogsDirectory(), 'combined.log'),
          }),
        ]
      : []),
  ],
  exitOnError: false,
});

function getLogsDirectory(): string {
  // Store logs in a 'logs' folder at the project root
  return join(process.cwd(), 'logs');
}

export { logger as Logger };
