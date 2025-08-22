import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StateManager } from './utils/helpers.js';
import { registerAllTools } from './tools/index.js';
import { registerBrowserStatusResource } from './resources/browserStatus.js';

export class SeleniumMcpServer {
  private server: McpServer;
  private stateManager: StateManager;

  constructor() {
    this.server = new McpServer({
      name: "selenium-webdriver-mcp",
      version: "0.1.4"
    });

    this.stateManager = new StateManager();
  }

  initialize(): void {
    // Register all tools
    registerAllTools(this.server, this.stateManager);

    // Register resources
    registerBrowserStatusResource(this.server, this.stateManager);

    // Setup cleanup handlers
    this.setupCleanup();
  }

  private setupCleanup(): void {
    const cleanup = async () => {
      const state = this.stateManager.getState();
      for (const [sessionId, driver] of state.drivers) {
        try {
          await driver.quit();
        } catch (e) {
          console.error(`Error closing browser session ${sessionId}:`, e);
        }
      }
      this.stateManager.clearDrivers();
      this.stateManager.resetCurrentSession();
      process.exit(0);
    };

    process.on('SIGTERM', cleanup);
    process.on('SIGINT', cleanup);
  }

  getServer(): McpServer {
    return this.server;
  }

  getStateManager(): StateManager {
    return this.stateManager;
  }
}