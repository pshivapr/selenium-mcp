import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StateManager } from '../utils/helpers.js';
import { BrowserService } from '../services/browserService.js';
import { browserOptionsSchema } from '../types/index.js';
import { z } from 'zod';

export function registerBrowserTools(server: McpServer, stateManager: StateManager) {
  server.tool(
    "browser_open",
    "Open a new browser session",
    {
      browser: z.enum(["chrome", "firefox", "edge"]).describe("Browser to launch"),
      options: browserOptionsSchema
    },
    async ({ browser, options = {} }) => {
      try {
        const driver = await BrowserService.createDriver(browser, options);
        const sessionId = `${browser}_${Date.now()}`;

        stateManager.addDriver(sessionId, driver);
        stateManager.setCurrentSession(sessionId);

        return {
          content: [{ type: 'text', text: `Browser started with session_id: ${sessionId}` }]
        };
      } catch (e) {
        return {
          content: [{ type: 'text', text: `Error starting browser: ${(e as Error).message}` }]
        };
      }
    }
  );

  server.tool(
    "browser_navigate",
    "Navigate to a URL",
    {
      url: z.string().describe("URL to navigate to")
    },
    async ({ url }) => {
      try {
        const driver = stateManager.getDriver();
        await driver.get(url);
        return {
          content: [{ type: 'text', text: `Navigated to ${url}` }]
        };
      } catch (e) {
        return {
          content: [{ type: 'text', text: `Error navigating: ${(e as Error).message}` }]
        };
      }
    }
  );

  server.tool(
    "browser_navigate_back",
    "Navigate back in the browser",
    {},
    async () => {
      try {
        const driver = stateManager.getDriver();
        await driver.navigate().back();
        return {
          content: [{ type: 'text', text: `Navigated back` }]
        };
      } catch (e) {
        return {
          content: [{ type: 'text', text: `Error navigating back: ${(e as Error).message}` }]
        };
      }
    }
  );

  server.tool(
    "browser_navigate_forward",
    "Navigate forward in the browser",
    {},
    async () => {
      try {
        const driver = stateManager.getDriver();
        await driver.navigate().forward();
        return {
          content: [{ type: 'text', text: `Navigated forward` }]
        };
      } catch (e) {
        return {
          content: [{ type: 'text', text: `Error navigating forward: ${(e as Error).message}` }]
        };
      }
    }
  );

  server.tool(
    "browser_resize",
    "Resize the browser window",
    {
      width: z.number().describe("New width of the browser window"),
      height: z.number().describe("New height of the browser window")
    },
    async ({ width, height }) => {
      try {
        const driver = stateManager.getDriver();
        await driver.manage().window().setRect({ width, height });
        return {
          content: [{ type: 'text', text: `Browser window resized to ${width}x${height}` }]
        };
      } catch (e) {
        return {
          content: [{ type: 'text', text: `Error resizing browser window: ${(e as Error).message}` }]
        };
      }
    }
  );

  server.tool(
    "browser_close",
    "Close the current browser session",
    {},
    async () => {
      try {
        const driver = stateManager.getDriver();
        await driver.quit();
        const sessionId = stateManager.getCurrentSession();

        if (sessionId) {
          stateManager.removeDriver(sessionId);
        }
        stateManager.resetCurrentSession();

        return {
          content: [{ type: 'text', text: `Browser session ${sessionId} closed` }]
        };
      } catch (e) {
        return {
          content: [{ type: 'text', text: `Error closing session: ${(e as Error).message}` }]
        };
      }
    }
  );
}