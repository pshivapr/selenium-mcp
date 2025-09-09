import winston from 'winston';

const logFormat = winston.format.combine(winston.format.errors({ stack: true }), winston.format.json());

const consoleFormat = winston.format.combine(winston.format.colorize(), winston.format.simple());

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports: [
    new winston.transports.Console({
      format: process.env.NODE_ENV === 'production' ? logFormat : consoleFormat,
    }),
    // Add file transport for production
    ...(process.env.NODE_ENV === 'production'
      ? [
          new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
          }),
          new winston.transports.File({
            filename: 'logs/combined.log',
          }),
        ]
      : []),
  ],
  // Prevent exit on error
  exitOnError: false,
});

// Handle logger errors
logger.on('error', error => {
  console.error('Logger error:', error);
});

// Export for compatibility
export { logger as Logger };
