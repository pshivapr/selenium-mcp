import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StateManager } from './utils/helpers.js';
import { registerAllTools } from './tools/index.js';
import { registerBrowserStatusResource } from './resources/browserStatus.js';

export class SeleniumMcpServer {
  private readonly server: McpServer;
  private readonly stateManager: StateManager;

  constructor() {
    this.server = new McpServer({
      name: 'selenium-webdriver-mcp',
      version: '0.2.6',
    });

    this.stateManager = new StateManager();
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
    const cleanup = async (): Promise<void> => {
      try {
        console.error('🧹 Cleaning up browser sessions...');
        const state = this.stateManager.getState();

        const cleanupPromises: Promise<void>[] = [];
        for (const [sessionId, driver] of state.drivers) {
          cleanupPromises.push(this.cleanupSession(sessionId, driver));
        }

        await Promise.allSettled(cleanupPromises);

        this.stateManager.clearDrivers();
        this.stateManager.resetCurrentSession();

        console.error('✅ Cleanup completed');
      } catch (error) {
        console.error('❌ Error during cleanup:', error);
      } finally {
        process.exit(0);
      }
    };

    // Register cleanup handlers
    process.on('SIGTERM', () => {
      console.error('🛑 SIGTERM received, initiating graceful shutdown...');
      cleanup().catch((error: unknown) => {
        console.error('Error during SIGTERM cleanup:', error);
        process.exit(1);
      });
    });

    process.on('SIGINT', () => {
      console.error('🛑 SIGINT received, initiating graceful shutdown...');
      cleanup().catch((error: unknown) => {
        console.error('Error during SIGINT cleanup:', error);
        process.exit(1);
      });
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error: Error) => {
      console.error('💥 Uncaught Exception:', error);
      cleanup().catch(() => {
        process.exit(1);
      });
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
      console.error('🚫 Unhandled Rejection at:', promise, 'reason:', reason);
      cleanup().catch(() => {
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
        await webDriver.quit();
      }

      console.error(`✅ Session ${sessionId} cleaned up successfully`);
    } catch (error) {
      console.error(`❌ Error closing browser session ${sessionId}:`, error);
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
      // If McpServer requires any initialization, call it here.
      // Currently, McpServer does not have a start method.
      console.error('✅ Selenium MCP Server initialized successfully');
    } catch (error) {
      console.error('❌ Failed to start Selenium MCP Server:', error);
      throw error;
    }
  }

  public async stop(): Promise<void> {
    try {
      console.error('🛑 Stopping Selenium MCP Server...');

      // Clean up all sessions
      const state = this.stateManager.getState();
      const cleanupPromises: Promise<void>[] = [];

      for (const [sessionId, driver] of state.drivers) {
        cleanupPromises.push(this.cleanupSession(sessionId, driver));
      }

      await Promise.allSettled(cleanupPromises);

      // Clear state
      this.stateManager.clearDrivers();
      this.stateManager.resetCurrentSession();

      // If the server has a stop method, call it; otherwise, skip stopping
      // (McpServer does not have a stop method in the current SDK)
      // If you need to implement custom shutdown logic, add it here.

      console.error('✅ Selenium MCP Server stopped successfully');
    } catch (error) {
      console.error('❌ Error stopping Selenium MCP Server:', error);
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
      status: 'healthy',
      activeSessions: state.drivers.size,
      serverName: 'selenium-webdriver-mcp',
      version: '0.2.6',
      uptime: process.uptime(),
    };
  }
}

export function createSeleniumMcpServer(options?: { autoStart?: boolean }): SeleniumMcpServer {
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
