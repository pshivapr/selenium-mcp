import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StateManager } from '../utils/helpers.js';
import { BrowserService } from '../services/browserService.js';
import { browserOptionsSchema } from '../types/index.js';
import { z } from 'zod';

export function registerBrowserTools(server: McpServer, stateManager: StateManager) {
  server.tool(
    'browser_open',
    'Open a new browser session',
    {
      browser: z.enum(['chrome', 'firefox', 'edge', 'safari']).describe('Browser to launch'),
      options: browserOptionsSchema,
    },
    async ({ browser, options = {} }) => {
      try {
        const driver = await BrowserService.createDriver(browser, options);
        const sessionId = `${browser}_${Date.now()}`;

        stateManager.addDriver(sessionId, driver);
        stateManager.setCurrentSession(sessionId);

        return {
          content: [
            {
              type: 'text',
              text: `Browser started with session_id: ${sessionId}`,
            },
          ],
        };
      } catch (e) {
        return {
          content: [
            {
              type: 'text',
              text: `Error starting browser: ${(e as Error).message}`,
            },
          ],
        };
      }
    }
  );

  server.tool(
    'browser_navigate',
    'Navigate to a URL',
    {
      url: z.string().describe('URL to navigate to'),
    },
    async ({ url }) => {
      try {
        const driver = stateManager.getDriver();
        await driver.get(url);
        return {
          content: [{ type: 'text', text: `Navigated to ${url}` }],
        };
      } catch (e) {
        return {
          content: [{ type: 'text', text: `Error navigating: ${(e as Error).message}` }],
        };
      }
    }
  );

  server.tool('browser_navigate_back', 'Navigate back in the browser', {}, async () => {
    try {
      const driver = stateManager.getDriver();
      await driver.navigate().back();
      return {
        content: [{ type: 'text', text: `Navigated back` }],
      };
    } catch (e) {
      return {
        content: [
          {
            type: 'text',
            text: `Error navigating back: ${(e as Error).message}`,
          },
        ],
      };
    }
  });

  server.tool('browser_navigate_forward', 'Navigate forward in the browser', {}, async () => {
    try {
      const driver = stateManager.getDriver();
      await driver.navigate().forward();
      return {
        content: [{ type: 'text', text: `Navigated forward` }],
      };
    } catch (e) {
      return {
        content: [
          {
            type: 'text',
            text: `Error navigating forward: ${(e as Error).message}`,
          },
        ],
      };
    }
  });

  server.tool('browser_title', 'Get the current page title', {}, async () => {
    try {
      const driver = stateManager.getDriver();
      const title = await driver.getTitle();
      return {
        content: [{ type: 'text', text: `Current page title is: ${title}` }],
      };
    } catch (e) {
      return {
        content: [
          {
            type: 'text',
            text: `Error getting page title: ${(e as Error).message}`,
          },
        ],
      };
    }
  });

  server.tool('browser_get_url', 'Get the current page URL', {}, async () => {
    try {
      const driver = stateManager.getDriver();
      const url = await driver.getCurrentUrl();
      return {
        content: [{ type: 'text', text: `Current page URL is: ${url}` }],
      };
    } catch (e) {
      return {
        content: [
          {
            type: 'text',
            text: `Error getting page URL: ${(e as Error).message}`,
          },
        ],
      };
    }
  });

  server.tool('browser_get_page_source', 'Get the current page source', {}, async () => {
    try {
      const driver = stateManager.getDriver();
      const pageSource = await driver.getPageSource();
      return {
        content: [{ type: 'text', text: `Current page source is: ${pageSource}` }],
      };
    } catch (e) {
      return {
        content: [
          {
            type: 'text',
            text: `Error getting page source: ${(e as Error).message}`,
          },
        ],
      };
    }
  });

  server.tool('browser_maximize', 'Maximize the browser window', {}, async () => {
    try {
      const driver = stateManager.getDriver();
      await driver.manage().window().maximize();
      return {
        content: [{ type: 'text', text: `Browser window maximised` }],
      };
    } catch (e) {
      return {
        content: [
          {
            type: 'text',
            text: `Error maximising browser window: ${(e as Error).message}`,
          },
        ],
      };
    }
  });

  server.tool(
    'browser_resize',
    'Resize the browser window',
    {
      width: z.number().describe('New width of the browser window'),
      height: z.number().describe('New height of the browser window'),
    },
    async ({ width, height }) => {
      try {
        const driver = stateManager.getDriver();
        await driver.manage().window().setRect({ width, height });
        return {
          content: [
            {
              type: 'text',
              text: `Browser window resized to ${width}x${height}`,
            },
          ],
        };
      } catch (e) {
        return {
          content: [
            {
              type: 'text',
              text: `Error resizing browser window: ${(e as Error).message}`,
            },
          ],
        };
      }
    }
  );

  server.tool('browser_refresh', 'Refresh the current page', {}, async () => {
    try {
      const driver = stateManager.getDriver();
      await driver.navigate().refresh();
      return {
        content: [{ type: 'text', text: `Browser refreshed` }],
      };
    } catch (e) {
      return {
        content: [
          {
            type: 'text',
            text: `Error refreshing browser: ${(e as Error).message}`,
          },
        ],
      };
    }
  });

  server.tool(
    'browser_switch_to_window',
    'Switch to a different browser window',
    {
      windowHandle: z.string().describe('The handle of the window to switch to'),
    },
    async ({ windowHandle }) => {
      try {
        const driver = stateManager.getDriver();
        await driver.switchTo().window(windowHandle);
        return {
          content: [{ type: 'text', text: `Switched to window: ${windowHandle}` }],
        };
      } catch (e) {
        return {
          content: [
            {
              type: 'text',
              text: `Error switching window: ${(e as Error).message}`,
            },
          ],
        };
      }
    }
  );

  server.tool('browser_switch_to_original_window', 'Switches back to the original browser window', {}, async () => {
    try {
      const driver = stateManager.getDriver();
      const windowHandles = await driver.getAllWindowHandles();
      await driver.switchTo().window(windowHandles[0]);
      return {
        content: [{ type: 'text', text: `Switched to original window` }],
      };
    } catch (e) {
      return {
        content: [
          {
            type: 'text',
            text: `Error switching to original window: ${(e as Error).message}`,
          },
        ],
      };
    }
  });

  server.tool(
    'browser_switch_to_window_by_title',
    'Switch to a window by its title',
    {
      title: z.string().describe('The title of the window to switch to'),
    },
    async ({ title }) => {
      try {
        const driver = stateManager.getDriver();
        const windowHandles = await driver.getAllWindowHandles();
        for (const handle of windowHandles) {
          await driver.switchTo().window(handle);
          const currentTitle = await driver.getTitle();
          if (currentTitle === title) {
            return {
              content: [{ type: 'text', text: `Switched to window: ${title}` }],
            };
          }
        }
        return {
          content: [{ type: 'text', text: `Window with title '${title}' not found` }],
        };
      } catch (e) {
        return {
          content: [
            {
              type: 'text',
              text: `Error switching to window by title: ${(e as Error).message}`,
            },
          ],
        };
      }
    }
  );

  server.tool(
    'browser_switch_window_by_index',
    'Switch to a window by its index',
    {
      index: z.number().describe('The index of the window to switch to'),
    },
    async ({ index }) => {
      try {
        const driver = stateManager.getDriver();
        const windowHandles = await driver.getAllWindowHandles();
        if (index < 0 || index >= windowHandles.length) {
          return {
            content: [{ type: 'text', text: `Invalid window index: ${index}` }],
          };
        }
        await driver.switchTo().window(windowHandles[index]);
        return {
          content: [{ type: 'text', text: `Switched to window at index: ${index}` }],
        };
      } catch (e) {
        return {
          content: [
            {
              type: 'text',
              text: `Error switching to window by index: ${(e as Error).message}`,
            },
          ],
        };
      }
    }
  );

  server.tool(
    'browser_switch_to_window_by_url',
    'Switch to a window by its URL',
    {
      url: z.string().describe('The URL of the window to switch to'),
    },
    async ({ url }) => {
      try {
        const driver = stateManager.getDriver();
        const windowHandles = await driver.getAllWindowHandles();
        for (const handle of windowHandles) {
          await driver.switchTo().window(handle);
          const currentUrl = await driver.getCurrentUrl();
          if (currentUrl === url) {
            return {
              content: [{ type: 'text', text: `Switched to window: ${url}` }],
            };
          }
        }
        return {
          content: [{ type: 'text', text: `Window with URL '${url}' not found` }],
        };
      } catch (e) {
        return {
          content: [
            {
              type: 'text',
              text: `Error switching to window by URL: ${(e as Error).message}`,
            },
          ],
        };
      }
    }
  );

  server.tool('browser_close', 'Close the current browser session', {}, async () => {
    try {
      const driver = stateManager.getDriver();
      await driver.quit();
      const sessionId = stateManager.getCurrentSession();

      if (sessionId) {
        stateManager.removeDriver(sessionId);
      }
      stateManager.resetCurrentSession();

      return {
        content: [{ type: 'text', text: `Browser session ${sessionId} closed` }],
      };
    } catch (e) {
      return {
        content: [
          {
            type: 'text',
            text: `Error closing session: ${(e as Error).message}`,
          },
        ],
      };
    }
  });
}
