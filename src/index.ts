#!/usr/bin/env node

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createSeleniumMcpServer } from './server.js';

/**
 * Application configuration interface
 */
interface AppConfig {
  enableHealthLogging: boolean;
  shutdownTimeout: number;
  logLevel: 'error' | 'warn' | 'info' | 'debug';
}

/**
 * Default application configuration
 */
const defaultConfig: AppConfig = {
  enableHealthLogging: true,
  shutdownTimeout: 5000, // 5 seconds
  logLevel: 'info',
};

/**
 * Enhanced logging utility
 */
class Logger {
  private config: AppConfig;

  constructor(config: AppConfig) {
    this.config = config;
  }

  public error(message: string, ...args: unknown[]): void {
    console.error(`❌ ${message}`, ...args);
  }

  public warn(message: string, ...args: unknown[]): void {
    if (this.shouldLog('warn')) {
      console.error(`⚠️  ${message}`, ...args);
    }
  }

  public info(message: string, ...args: unknown[]): void {
    if (this.shouldLog('info')) {
      console.error(`ℹ️  ${message}`, ...args);
    }
  }

  public debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog('debug')) {
      console.error(`🐛 ${message}`, ...args);
    }
  }

  private shouldLog(level: string): boolean {
    const levels = ['error', 'warn', 'info', 'debug'];
    const currentLevelIndex = levels.indexOf(this.config.logLevel);
    const targetLevelIndex = levels.indexOf(level);
    return targetLevelIndex <= currentLevelIndex;
  }
}

/**
 * Main application class
 */
class SeleniumMcpApplication {
  private readonly config: AppConfig;
  private readonly logger: Logger;
  private seleniumServer: ReturnType<typeof createSeleniumMcpServer> | null = null;
  private isShuttingDown = false;

  constructor(config: AppConfig = defaultConfig) {
    this.config = { ...defaultConfig, ...config };
    this.logger = new Logger(this.config);
  }

  /**
   * Initialize and start the application
   */
  public async start(): Promise<void> {
    try {
      this.logger.info('🚀 Initializing Selenium MCP Server...');

      // Create and initialize the server using the factory function
      this.seleniumServer = createSeleniumMcpServer();

      this.logger.info('🔗 Setting up transport...');

      // Create stdio transport
      const transport = new StdioServerTransport();

      // Connect the server to the transport
      await this.seleniumServer.getServer().connect(transport);

      this.logger.info('✅ Selenium MCP Server started and listening on stdio');

      if (this.config.enableHealthLogging) {
        this.logServerHealth();
      }

      // Setup signal handlers
      this.setupSignalHandlers();

      // Setup error handlers
      this.setupErrorHandlers();
    } catch (error) {
      this.logger.error('Failed to initialize server:', error);
      throw error;
    }
  }

  /**
   * Log server health information
   */
  private logServerHealth(): void {
    if (!this.seleniumServer) {
      return;
    }

    try {
      const health = this.seleniumServer.getHealthStatus();
      this.logger.info('📊 Server health:', JSON.stringify(health, null, 2));
    } catch (error) {
      this.logger.warn('Failed to get server health:', error);
    }
  }

  /**
   * Setup signal handlers for graceful shutdown
   */
  private setupSignalHandlers(): void {
    const signals: NodeJS.Signals[] = ['SIGTERM', 'SIGINT'];

    signals.forEach(signal => {
      process.on(signal, () => {
        this.logger.info(`🛑 Received ${signal}, initiating graceful shutdown...`);
        this.handleShutdown(signal).catch((error: unknown) => {
          this.logger.error(`Error in ${signal} handler:`, error);
          process.exit(1);
        });
      });
    });
  }

  /**
   * Setup error handlers
   */
  private setupErrorHandlers(): void {
    // Handle uncaught exceptions
    process.on('uncaughtException', (error: Error) => {
      this.logger.error('💥 Uncaught Exception:', error);
      this.handleShutdown('uncaughtException').catch(() => process.exit(1));
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
      this.logger.error('🚫 Unhandled Rejection at:', promise, 'reason:', reason);
      this.handleShutdown('unhandledRejection').catch(() => process.exit(1));
    });
  }

  /**
   * Handle graceful shutdown
   */
  private async handleShutdown(signal: string): Promise<void> {
    if (this.isShuttingDown) {
      this.logger.warn('Shutdown already in progress, forcing exit...');
      process.exit(1);
      return;
    }

    this.isShuttingDown = true;

    try {
      this.logger.info(`🛑 Shutting down due to ${signal}...`);

      // Set up timeout for forced shutdown
      const shutdownTimer = setTimeout(() => {
        this.logger.error('⏰ Shutdown timeout reached, forcing exit...');
        process.exit(1);
      }, this.config.shutdownTimeout);

      // Perform graceful shutdown
      if (this.seleniumServer) {
        await this.seleniumServer.stop();
        this.logger.info('✅ Server stopped successfully');
      }

      // Clear timeout
      clearTimeout(shutdownTimer);

      this.logger.info('✅ Shutdown completed');
      process.exit(0);
    } catch (error) {
      this.logger.error('❌ Error during shutdown:', error);
      process.exit(1);
    }
  }

  /**
   * Get application statistics
   */
  public getStats(): {
    app: {
      uptime: number;
      memoryUsage: NodeJS.MemoryUsage;
      config: AppConfig;
    };
    server?: ReturnType<typeof createSeleniumMcpServer>['getHealthStatus'] extends () => infer R ? R : never;
  } {
    const stats = {
      app: {
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        config: this.config,
      },
    };

    if (this.seleniumServer) {
      return {
        ...stats,
        server: this.seleniumServer.getHealthStatus(),
      };
    }

    return stats;
  }
}

/**
 * Main function to start the application
 */
async function main(): Promise<void> {
  // Parse environment variables for configuration
  const config: Partial<AppConfig> = {
    enableHealthLogging: process.env.ENABLE_HEALTH_LOGGING !== 'false',
    shutdownTimeout: process.env.SHUTDOWN_TIMEOUT ? parseInt(process.env.SHUTDOWN_TIMEOUT, 10) : undefined,
    logLevel: (process.env.LOG_LEVEL as AppConfig['logLevel']) || 'info',
  };

  // Create and start application
  const app = new SeleniumMcpApplication(config as AppConfig);

  try {
    await app.start();
  } catch (error) {
    console.error('❌ Failed to start application:', error);
    process.exit(1);
  }
}

/**
 * Start the application with comprehensive error handling
 */
main().catch((error: unknown) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});
