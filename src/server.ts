import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StateManager } from './utils/helpers.js';
import { registerAllTools } from './tools/index.js';
import { registerBrowserStatusResource } from './resources/browserStatus.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const configPath = join(__dirname, '..', 'version.config.json');

interface VersionConfig {
  name: string;
  version: string;
  displayName?: string;
}

let versionConfig: VersionConfig;
const configContent = readFileSync(configPath, 'utf8');
versionConfig = JSON.parse(configContent);

export class SeleniumMcpServer {
  private readonly server: McpServer;
  private readonly stateManager: StateManager;
  private readonly startTime: number;
  private isShuttingDown: boolean = false;

  constructor() {
    this.server = new McpServer({
      name: versionConfig.name,
      version: versionConfig.version,
    });

    this.stateManager = new StateManager();
    this.startTime = Date.now();
  }

  public initialize(): void {
    // Register all tools
    registerAllTools(this.server, this.stateManager);

    // Register resources
    registerBrowserStatusResource(this.server, this.stateManager);

    // Setup cleanup handlers
    this.setupCleanup();
  }

  private setupCleanup(): void {
    const cleanup = async (signal?: string): Promise<void> => {
      if (this.isShuttingDown) {
        console.error('⚠️  Shutdown already in progress...');
        return;
      }

      this.isShuttingDown = true;

      try {
        if (signal) {
          console.error(`🛑 ${signal} received, initiating graceful shutdown...`);
        } else {
          console.error('🛑 Initiating graceful shutdown...');
        }

        console.error('🧹 Cleaning up browser sessions...');
        const state = this.stateManager.getState();

        if (state.drivers.size > 0) {
          const cleanupPromises: Promise<void>[] = [];
          for (const [sessionId, driver] of state.drivers) {
            cleanupPromises.push(this.cleanupSession(sessionId, driver));
          }

          // Wait for all cleanup operations with a timeout
          await Promise.race([
            Promise.allSettled(cleanupPromises),
            new Promise(resolve => setTimeout(resolve, 10000)), // 10 second timeout
          ]);
        }

        this.stateManager.clearDrivers();
        this.stateManager.resetCurrentSession();

        console.error('✅ Cleanup completed successfully');
      } catch (error) {
        console.error('❌ Error during cleanup:', error);
      } finally {
        this.isShuttingDown = false;
      }
    };

    // Register cleanup handlers - don't exit process in cleanup
    process.on('SIGTERM', () => {
      cleanup('SIGTERM')
        .then(() => {
          process.exit(0);
        })
        .catch((error: unknown) => {
          console.error('Error during SIGTERM cleanup:', error);
          process.exit(1);
        });
    });

    process.on('SIGINT', () => {
      cleanup('SIGINT')
        .then(() => {
          process.exit(0);
        })
        .catch((error: unknown) => {
          console.error('Error during SIGINT cleanup:', error);
          process.exit(1);
        });
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error: Error) => {
      console.error('💥 Uncaught Exception:', error);
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
      console.error('🚫 Unhandled Rejection at:', promise, 'reason:', reason);
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
      console.error(`🧹 Cleaning up session: ${sessionId}`);

      // Type guard to ensure driver has quit method
      if (driver && typeof driver === 'object' && 'quit' in driver) {
        const webDriver = driver as { quit: () => Promise<void> };

        // Add timeout to quit operation
        await Promise.race([
          webDriver.quit(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Quit timeout')), 5000)),
        ]);
      }

      console.error(`✅ Session ${sessionId} cleaned up successfully`);
    } catch (error) {
      console.error(`❌ Error closing browser session ${sessionId}:`, error);
      // Don't throw - just log and continue with other cleanups
    }
  }

  public getServer(): McpServer {
    return this.server;
  }

  public getStateManager(): StateManager {
    return this.stateManager;
  }

  public async start(): Promise<void> {
    try {
      console.error('🚀 Starting Selenium MCP Server...');
      console.error('✅ Selenium MCP Server initialized successfully');
    } catch (error) {
      console.error('❌ Failed to start Selenium MCP Server:', error);
      throw error;
    }
  }

  public async stop(): Promise<void> {
    if (this.isShuttingDown) {
      console.error('⚠️  Server is already shutting down...');
      return;
    }

    try {
      this.isShuttingDown = true;
      console.error('🛑 Stopping Selenium MCP Server...');

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
          new Promise(resolve => setTimeout(resolve, 10000)), // 10 second timeout
        ]);
      }

      // Clear state
      this.stateManager.clearDrivers();
      this.stateManager.resetCurrentSession();

      console.error('✅ Selenium MCP Server stopped successfully');
    } catch (error) {
      console.error('❌ Error stopping Selenium MCP Server:', error);
      throw error;
    } finally {
      this.isShuttingDown = false;
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
      status: this.isShuttingDown ? 'unhealthy' : 'healthy',
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
  const server = new SeleniumMcpServer();
  server.initialize();

  if (options?.autoStart) {
    server.start().catch((error: unknown) => {
      console.error('Failed to auto-start server:', error);
      process.exit(1);
    });
  }

  return server;
}

export default SeleniumMcpServer;
