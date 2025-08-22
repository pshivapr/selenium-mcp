import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StateManager } from '../utils/helpers.js';
import { ActionService } from '../services/actionService.js';
import { locatorSchema } from '../types/index.js';
import { z } from 'zod';

export function registerActionTools(server: McpServer, stateManager: StateManager) {
  server.tool(
    "browser_hover",
    "Hover over an element",
    { ...locatorSchema },
    async ({ by, value, timeout = 15000 }) => {
      try {
        const driver = stateManager.getDriver();
        const actionService = new ActionService(driver);
        await actionService.hoverOverElement({ by, value, timeout });
        return {
          content: [{ type: 'text', text: 'Hovered over element' }]
        };
      } catch (e) {
        return {
          content: [{ type: 'text', text: `Error hovering over element: ${(e as Error).message}` }]
        };
      }
    }
  );

  server.tool(
    "browser_wait_for_element",
    "Wait for an element to be present",
    { ...locatorSchema, timeout: z.number().describe("Timeout in milliseconds") },
    async ({ by, value, timeout = 15000 }) => {
      try {
        const driver = stateManager.getDriver();
        const actionService = new ActionService(driver);
        await actionService.waitForElement({ by, value, timeout });
        return {
          content: [{ type: 'text', text: `Waited for element: ${value}` }]
        };
      } catch (e) {
        return {
          content: [{ type: 'text', text: `Error waiting for element: ${(e as Error).message}` }]
        };
      }
    }
  );

  server.tool(
    "browser_drag_and_drop",
    "Perform drag and drop between two elements",
    {
      ...locatorSchema,
      targetBy: z.enum(["id", "css", "xpath", "name", "tag", "class"]).describe("Locator strategy to find target element"),
      targetValue: z.string().describe("Value for the target locator strategy")
    },
    async ({ by, value, targetBy, targetValue, timeout = 15000 }) => {
      try {
        const driver = stateManager.getDriver();
        const actionService = new ActionService(driver);
        await actionService.dragAndDrop(
          { by, value, timeout },
          { by: targetBy, value: targetValue, timeout }
        );
        return {
          content: [{ type: 'text', text: 'Drag and drop completed' }]
        };
      } catch (e) {
        return {
          content: [{ type: 'text', text: `Error performing drag and drop: ${(e as Error).message}` }]
        };
      }
    }
  );

  server.tool(
    "browser_double_click",
    "Perform double click on an element",
    { ...locatorSchema },
    async ({ by, value, timeout = 15000 }) => {
      try {
        const driver = stateManager.getDriver();
        const actionService = new ActionService(driver);
        await actionService.doubleClickElement({ by, value, timeout });
        return {
          content: [{ type: 'text', text: 'Double click performed' }]
        };
      } catch (e) {
        return {
          content: [{ type: 'text', text: `Error performing double click: ${(e as Error).message}` }]
        };
      }
    }
  );

  server.tool(
    "browser_right_click",
    "Perform right click (context click) on an element",
    { ...locatorSchema },
    async ({ by, value, timeout = 15000 }) => {
      try {
        const driver = stateManager.getDriver();
        const actionService = new ActionService(driver);
        await actionService.rightClickElement({ by, value, timeout });
        return {
          content: [{ type: 'text', text: 'Right click performed' }]
        };
      } catch (e) {
        return {
          content: [{ type: 'text', text: `Error performing right click: ${(e as Error).message}` }]
        };
      }
    }
  );

  server.tool(
    "browser_select_dropdown_by_text",
    "Select dropdown by visible text",
    { ...locatorSchema, text: z.string().describe("Visible text of the option to select") },
    async ({ by, value, text, timeout = 15000 }) => {
      try {
        const driver = stateManager.getDriver();
        const actionService = new ActionService(driver);
        await actionService.selectDropdownByText({ by, value, text, timeout });
        return {
          content: [{ type: 'text', text: `Selected dropdown option by text: ${text}` }]
        };
      } catch (e) {
        return {
          content: [{ type: 'text', text: `Error selecting dropdown option by text: ${(e as Error).message}` }]
        };
      }
    }
  );

  server.tool(
    "browser_select_dropdown_by_value",
    "Select dropdown by value",
    { ...locatorSchema, value: z.string().describe("Value of the option to select") },
    async ({ by, value, timeout = 15000 }) => {
      try {
        const driver = stateManager.getDriver();
        const actionService = new ActionService(driver);
        await actionService.selectDropdownByValue({ by, value, timeout });
        return {
          content: [{ type: 'text', text: `Selected dropdown option by value: ${value}` }]
        };
      } catch (e) {
        return {
          content: [{ type: 'text', text: `Error selecting dropdown option by value: ${(e as Error).message}` }]
        };
      }
    }
  );

  server.tool(
    "browser_key_press",
    "Press a key on the keyboard",
    {
      key: z.string().describe("Key to press (e.g., 'Enter', 'Tab', 'a', etc.)")
    },
    async ({ key }) => {
      try {
        const driver = stateManager.getDriver();
        const actionService = new ActionService(driver);
        await actionService.pressKey(key);
        return {
          content: [{ type: 'text', text: `Key '${key}' pressed` }]
        };
      } catch (e) {
        return {
          content: [{ type: 'text', text: `Error pressing key: ${(e as Error).message}` }]
        };
      }
    }
  );

  server.tool(
    "browser_execute_script",
    "Execute JavaScript in the context of the current page",
    {
      script: z.string().describe("JavaScript code to execute")
    },
    async ({ script }) => {
      try {
        const driver = stateManager.getDriver();
        const actionService = new ActionService(driver);
        const result = await actionService.executeScript(script);
        return {
          content: [{ type: 'text', text: `Script executed successfully: ${result}` }]
        };
      } catch (e) {
        return {
          content: [{ type: 'text', text: `Error executing script: ${(e as Error).message}` }]
        };
      }
    }
  );

  server.tool(
    "browser_scroll_to_element",
    "Scroll to an element",
    { ...locatorSchema },
    async ({ by, value, timeout = 15000 }) => {
      try {
        const driver = stateManager.getDriver();
        const actionService = new ActionService(driver);
        await actionService.scrollToElement({ by, value, timeout });
        return {
          content: [{ type: 'text', text: `Scrolled to element` }]
        };
      } catch (e) {
        return {
          content: [{ type: 'text', text: `Error scrolling to element: ${(e as Error).message}` }]
        };
      }
    }
  );

  server.tool(
    "browser_screenshot",
    "Take a screenshot of the current page",
    {
      outputPath: z.string().optional().describe("Optional path where to save the screenshot. If not provided, returns base64 data.")
    },
    async ({ outputPath }) => {
      try {
        const driver = stateManager.getDriver();
        const actionService = new ActionService(driver);
        const screenshot = await actionService.takeScreenshot();

        if (outputPath) {
          const fs = await import('fs/promises');
          await fs.writeFile(outputPath, screenshot, 'base64');
          return {
            content: [{ type: 'text', text: `Screenshot saved to ${outputPath}` }]
          };
        } else {
          return {
            content: [
              { type: 'text', text: 'Screenshot captured as base64:' },
              { type: 'text', text: screenshot }
            ]
          };
        }
      } catch (e) {
        return {
          content: [{ type: 'text', text: `Error taking screenshot: ${(e as Error).message}` }]
        };
      }
    }
  );
}