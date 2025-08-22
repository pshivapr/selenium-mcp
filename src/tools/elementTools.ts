import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StateManager } from '../utils/helpers.js';
import { ElementService } from '../services/elementService.js';
import { locatorSchema } from '../types/index.js';
import { z } from 'zod';

export function registerElementTools(server: McpServer, stateManager: StateManager) {
  server.tool(
    "browser_find_element",
    "Find an element",
    { ...locatorSchema },
    async ({ by, value, timeout = 15000 }) => {
      try {
        const driver = stateManager.getDriver();
        const elementService = new ElementService(driver);
        await elementService.findElement({ by, value, timeout });
        return {
          content: [{ type: 'text', text: 'Element found' }]
        };
      } catch (e) {
        return {
          content: [{ type: 'text', text: `Error finding element: ${(e as Error).message}` }]
        };
      }
    }
  );

  server.tool(
    "browser_click",
    "Perform a click on an element",
    { ...locatorSchema },
    async ({ by, value, timeout = 15000 }) => {
      try {
        const driver = stateManager.getDriver();
        const elementService = new ElementService(driver);
        await elementService.clickElement({ by, value, timeout });
        return {
          content: [{ type: 'text', text: 'Element clicked' }]
        };
      } catch (e) {
        return {
          content: [{ type: 'text', text: `Error clicking element: ${(e as Error).message}` }]
        };
      }
    }
  );

  server.tool(
    "browser_type",
    "Type into an editable field",
    {
      ...locatorSchema,
      text: z.string().describe("Text to enter into the element")
    },
    async ({ by, value, text, timeout = 15000 }) => {
      try {
        const driver = stateManager.getDriver();
        const elementService = new ElementService(driver);
        await elementService.sendKeysToElement({ by, value, text, timeout });
        return {
          content: [{ type: 'text', text: `Text "${text}" entered into element` }]
        };
      } catch (e) {
        return {
          content: [{ type: 'text', text: `Error entering text: ${(e as Error).message}` }]
        };
      }
    }
  );

  server.tool(
    "browser_get_element_text",
    "Gets the text of an element",
    { ...locatorSchema },
    async ({ by, value, timeout = 15000 }) => {
      try {
        const driver = stateManager.getDriver();
        const elementService = new ElementService(driver);
        const text = await elementService.getElementText({ by, value, timeout });
        return {
          content: [{ type: 'text', text }]
        };
      } catch (e) {
        return {
          content: [{ type: 'text', text: `Error getting element text: ${(e as Error).message}` }]
        };
      }
    }
  );

  server.tool(
    "browser_upload_file",
    "Uploads a file using a file input element",
    {
      ...locatorSchema,
      filePath: z.string().describe("Absolute path to the file to upload")
    },
    async ({ by, value, filePath, timeout = 15000 }) => {
      try {
        const driver = stateManager.getDriver();
        const elementService = new ElementService(driver);
        await elementService.uploadFile({ by, value, filePath, timeout });
        return {
          content: [{ type: 'text', text: 'File upload initiated' }]
        };
      } catch (e) {
        return {
          content: [{ type: 'text', text: `Error uploading file: ${(e as Error).message}` }]
        };
      }
    }
  );
}