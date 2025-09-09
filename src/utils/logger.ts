export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LoggerConfig {
  level: LogLevel;
  timestamp: boolean;
  prefix: string;
}

export class Logger {
  private static config: LoggerConfig = {
    level: process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO,
    timestamp: false, // MCP servers typically don't use timestamps in stdio
    prefix: 'Selenium-MCP',
  };

  static configure(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  private static formatMessage(level: LogLevel, message: string): string {
    const timestamp = this.config.timestamp ? `${new Date().toISOString()} ` : '';
    const levelStr = LogLevel[level];
    const prefix = this.config.prefix ? `[${this.config.prefix}] ` : '';

    return `${timestamp}${prefix}[${levelStr}] ${message}`;
  }

  private static shouldLog(level: LogLevel): boolean {
    return level >= this.config.level;
  }

  static debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.log(this.formatMessage(LogLevel.DEBUG, message), ...args);
    }
  }

  static info(message: string, ...args: unknown[]): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.log(this.formatMessage(LogLevel.INFO, message), ...args);
    }
  }

  static warn(message: string, ...args: unknown[]): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage(LogLevel.WARN, message), ...args);
    }
  }

  static error(message: string, ...args: unknown[]): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(this.formatMessage(LogLevel.ERROR, message), ...args);
    }
  }
}
