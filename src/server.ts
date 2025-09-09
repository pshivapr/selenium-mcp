import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StateManager } from './utils/helpers.js';
import { registerAllTools } from './tools/index.js';
import { registerBrowserStatusResource } from './resources/browserStatus.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Logger } from './utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const configPath = join(__dirname, '..', 'version.config.json');
const CLEANUP_TIMEOUT_MS = 10000; // 10 seconds for overall cleanup
const SESSION_QUIT_TIMEOUT_MS = 5000; // 5 seconds per session quit operation

interface VersionConfig {
  name: string;
  version: string;
  displayName?: string;
}

// Load version config with proper error handling
let versionConfig: VersionConfig;
const configContent = readFileSync(configPath, 'utf8');
versionConfig = JSON.parse(configContent);

export class SeleniumMcpServer {
  private readonly server: McpServer;
  private readonly stateManager: StateManager;
  private readonly startTime: number;
  private isShuttingDown: boolean = false;
  private isInitialized: boolean = false;

  constructor() {
    try {
      this.server = new McpServer({
        name: versionConfig.name,
        version: versionConfig.version,
      });

      this.stateManager = new StateManager();
      this.startTime = Date.now();
      Logger.debug('✅ SeleniumMcpServer constructor completed');
    } catch (error) {
      Logger.error('❌ Error in SeleniumMcpServer constructor:', error);
      throw error;
    }
  }

  public initialize(): void {
    try {
      Logger.info('🔧 Initializing Selenium MCP Server...');

      // Register all tools
      registerAllTools(this.server, this.stateManager);
      Logger.debug('✅ Tools registered');

      // Register resources
      registerBrowserStatusResource(this.server, this.stateManager);
      Logger.debug('✅ Resources registered');

      // Setup cleanup handlers
      this.setupCleanup();
      Logger.debug('✅ Cleanup handlers registered');

      this.isInitialized = true;
      Logger.info('✅ Server initialization completed');
    } catch (error) {
      Logger.error('❌ Error during server initialization:', error);
      throw error;
    }
  }

  private setupCleanup(): void {
    const cleanup = async (signal?: string): Promise<void> => {
      if (this.isShuttingDown) {
        Logger.warn('⚠️  Shutdown already in progress...');
        return;
      }

      this.isShuttingDown = true;

      try {
        if (signal) {
          Logger.info(`🛑 ${signal} received, initiating graceful shutdown...`);
        } else {
          Logger.info('🛑 Initiating graceful shutdown...');
        }

        Logger.info('🧹 Cleaning up browser sessions...');
        const state = this.stateManager.getState();

        if (state.drivers.size > 0) {
          const cleanupPromises: Promise<void>[] = [];
          for (const [sessionId, driver] of state.drivers) {
            cleanupPromises.push(this.cleanupSession(sessionId, driver));
          }

          // Wait for all cleanup operations with a timeout
          await Promise.race([
            Promise.allSettled(cleanupPromises),
            new Promise(resolve => setTimeout(resolve, CLEANUP_TIMEOUT_MS)),
          ]);
        }

        this.stateManager.clearDrivers();
        this.stateManager.resetCurrentSession();

        Logger.info('✅ Cleanup completed successfully');
      } catch (error) {
        Logger.error('❌ Error during cleanup:', error);
      }
    };

    // Register cleanup handlers - don't exit process in cleanup
    process.on('SIGTERM', () => {
      cleanup('SIGTERM')
        .then(() => {
          process.exit(0);
        })
        .catch((error: unknown) => {
          Logger.error('Error during SIGTERM cleanup:', error);
          process.exit(1);
        });
    });

    process.on('SIGINT', () => {
      cleanup('SIGINT')
        .then(() => {
          process.exit(0);
        })
        .catch((error: unknown) => {
          Logger.error('Error during SIGINT cleanup:', error);
          process.exit(1);
        });
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error: Error) => {
      Logger.error('💥 Uncaught Exception:', error);
      cleanup('uncaughtException')
        .then(() => {
          process.exit(1);
        })
        .catch(() => {
          process.exit(1);
        });
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
      Logger.error('🚫 Unhandled Rejection at:', promise, 'reason:', reason);
      cleanup('unhandledRejection')
        .then(() => {
          process.exit(1);
        })
        .catch(() => {
          process.exit(1);
        });
    });
  }

  private async cleanupSession(sessionId: string, driver: unknown): Promise<void> {
    try {
      Logger.debug(`🧹 Cleaning up session: ${sessionId}`);

      // Type guard to ensure driver has quit method
      if (driver && typeof driver === 'object' && 'quit' in driver) {
        const webDriver = driver as { quit: () => Promise<void> };

        // Add timeout to quit operation
        await Promise.race([
          webDriver.quit(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Quit timeout')), SESSION_QUIT_TIMEOUT_MS)),
        ]);
      }

      Logger.debug(`✅ Session ${sessionId} cleaned up successfully`);
    } catch (error) {
      Logger.error(`❌ Error closing browser session ${sessionId}:`, error);
      // Don't throw - just log and continue with other cleanups
    }
  }

  public getServer(): McpServer {
    return this.server;
  }

  public getStateManager(): StateManager {
    return this.stateManager;
  }

  public isReady(): boolean {
    return this.isInitialized && !this.isShuttingDown;
  }

  public async start(): Promise<void> {
    if (this.isShuttingDown) {
      throw new Error('Cannot start server while shutting down');
    }

    if (!this.isInitialized) {
      throw new Error('Server must be initialized before starting');
    }

    try {
      Logger.info('🚀 Starting Selenium MCP Server...');
      Logger.info('✅ Selenium MCP Server started successfully');
    } catch (error) {
      Logger.error('❌ Failed to start Selenium MCP Server:', error);
      throw error;
    }
  }

  public async stop(): Promise<void> {
    if (this.isShuttingDown) {
      Logger.warn('⚠️  Server is already shutting down...');
      return;
    }

    try {
      this.isShuttingDown = true;
      Logger.info('🛑 Stopping Selenium MCP Server...');

      // Clean up all sessions
      const state = this.stateManager.getState();

      if (state.drivers.size > 0) {
        const cleanupPromises: Promise<void>[] = [];

        for (const [sessionId, driver] of state.drivers) {
          cleanupPromises.push(this.cleanupSession(sessionId, driver));
        }

        // Wait for cleanup with timeout
        await Promise.race([
          Promise.allSettled(cleanupPromises),
          new Promise(resolve => setTimeout(resolve, CLEANUP_TIMEOUT_MS)),
        ]);
      }

      // Clear state
      this.stateManager.clearDrivers();
      this.stateManager.resetCurrentSession();

      Logger.info('✅ Selenium MCP Server stopped successfully');
    } catch (error) {
      Logger.error('❌ Error stopping Selenium MCP Server:', error);
      throw error;
    }
  }

  public getHealthStatus(): {
    status: 'healthy' | 'unhealthy';
    activeSessions: number;
    serverName: string;
    version: string;
    uptime: number;
  } {
    const state = this.stateManager.getState();

    return {
      status: this.isInitialized && !this.isShuttingDown ? 'healthy' : 'unhealthy',
      activeSessions: state.drivers.size,
      serverName: versionConfig.name,
      version: versionConfig.version,
      uptime: process.uptime(),
    };
  }

  public getStats(): {
    server: {
      name: string;
      version: string;
      uptime: number;
      memoryUsage: NodeJS.MemoryUsage;
      isShuttingDown: boolean;
    };
    sessions: {
      total: number;
      active: number;
      sessionIds: string[];
      currentSession: string | null;
    };
  } {
    const state = this.stateManager.getState();
    const sessionIds = Array.from(state.drivers.keys());

    return {
      server: {
        name: versionConfig.name,
        version: versionConfig.version,
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        isShuttingDown: this.isShuttingDown,
      },
      sessions: {
        total: state.drivers.size,
        active: state.drivers.size,
        sessionIds,
        currentSession: state.currentSession,
      },
    };
  }
}

export function createSeleniumMcpServer(options?: {
  autoStart?: boolean;
  enableHealthLogging?: boolean;
  shutdownTimeout?: number;
}): SeleniumMcpServer {
  try {
    Logger.info('🏗️  Creating Selenium MCP Server...');
    const server = new SeleniumMcpServer();

    Logger.debug('🔧 Initializing server...');
    server.initialize();

    if (options?.autoStart) {
      server.start().catch((error: unknown) => {
        Logger.error('Failed to auto-start server:', error);
        process.exit(1);
      });
    }

    Logger.info('✅ Selenium MCP Server created successfully');
    return server;
  } catch (error) {
    Logger.error('❌ Failed to create Selenium MCP Server:', error);
    throw error;
  }
}

export default SeleniumMcpServer;
