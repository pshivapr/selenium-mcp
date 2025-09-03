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
    "browser_find_elements",
    "Find multiple elements",
    { ...locatorSchema },
    async ({ by, value, timeout = 15000 }) => {
      try {
        const driver = stateManager.getDriver();
        const elementService = new ElementService(driver);
        const elements = await elementService.findElements({ by, value, timeout });
        return {
          content: [{ type: 'text', text: `Found ${elements.length} elements` }]
        };
      } catch (e) {
        return {
          content: [{ type: 'text', text: `Error finding elements: ${(e as Error).message}` }]
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
    "browser_clear",
    "Clears the value of an input element",
    { ...locatorSchema },
    async ({ by, value, timeout = 15000 }) => {
      try {
        const driver = stateManager.getDriver();
        const elementService = new ElementService(driver);
        await elementService.clearElement({ by, value, timeout });
        return {
          content: [{ type: 'text', text: 'Element cleared' }]
        };
      } catch (e) {
        return {
          content: [{ type: 'text', text: `Error clearing element: ${(e as Error).message}` }]
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
    "browser_get_attribute",
    "Gets the value of an attribute from an element",
    {
      ...locatorSchema,
      attribute: z.string().describe("Name of the attribute to get")
    },
    async ({ by, value, attribute, timeout = 15000 }) => {
      try {
        const driver = stateManager.getDriver();
        const elementService = new ElementService(driver);
        const attrValue = await elementService.getElementAttribute({ by, value, attribute, timeout });
        return {
          content: [{ type: 'text', text: `Attribute "${attribute}" has value: ${attrValue}` }]
        };
      } catch (e) {
        return {
          content: [{ type: 'text', text: `Error getting attribute: ${(e as Error).message}` }]
        };
      }
    }
  );

  server.tool(
    "browser_element_is_displayed",
    "Checks if an element is displayed",
    { ...locatorSchema },
    async ({ by, value, timeout = 15000 }) => {
      try {
        const driver = stateManager.getDriver();
        const elementService = new ElementService(driver);
        const isDisplayed = await elementService.isElementDisplayed({ by, value, timeout });
        return {
          content: [{ type: 'text', text: `Element is displayed: ${isDisplayed}` }]
        };
      } catch (e) {
        return {
          content: [{ type: 'text', text: `Error checking element display status: ${(e as Error).message}` }]
        };
      }
    }
  );

  server.tool(
    "browser_element_is_enabled",
    "Checks if an element is enabled",
    { ...locatorSchema },
    async ({ by, value, timeout = 15000 }) => {
      try {
        const driver = stateManager.getDriver();
        const elementService = new ElementService(driver);
        const isEnabled = await elementService.isElementEnabled({ by, value, timeout });
        return {
          content: [{ type: 'text', text: `Element is enabled: ${isEnabled}` }]
        };
      } catch (e) {
        return {
          content: [{ type: 'text', text: `Error checking element enabled status: ${(e as Error).message}` }]
        };
      }
    }
  );

  server.tool(
    "browser_element_is_selected",
    "Checks if an element is selected",
    { ...locatorSchema },
    async ({ by, value, timeout = 15000 }) => {
      try {
        const driver = stateManager.getDriver();
        const elementService = new ElementService(driver);
        const isSelected = await elementService.isElementSelected({ by, value, timeout });
        return {
          content: [{ type: 'text', text: `Element is selected: ${isSelected}` }]
        };
      } catch (e) {
        return {
          content: [{ type: 'text', text: `Error checking element selected status: ${(e as Error).message}` }]
        };
      }
    }
  );

  server.tool(
    "browser_switch_to_frame",
    "Switches to an iframe element",
    { ...locatorSchema },
    async ({ by, value, timeout = 15000 }) => {
      try {
        const driver = stateManager.getDriver();
        const elementService = new ElementService(driver);
        await elementService.switchToFrame({ by, value, timeout });
        return {
          content: [{ type: 'text', text: 'Switched to iframe' }]
        };
      } catch (e) {
        return {
          content: [{ type: 'text', text: `Error switching to frame: ${(e as Error).message}` }]
        };
      }
    }
  );

  server.tool(
    "browser_switch_to_default_content",
    "Switches to the default content",
    async () => {
      try {
        const driver = stateManager.getDriver();
        const elementService = new ElementService(driver);
        await elementService.switchToDefaultContent();
        return {
          content: [{ type: 'text', text: 'Switched to default content' }]
        };
      } catch (e) {
        return {
          content: [{ type: 'text', text: `Error switching to default content: ${(e as Error).message}` }]
        };
      }
    }
  );

  server.tool(
    "browser_switch_to_parent_frame",
    "Switches to the parent iframe",
    async () => {
      try {
        const driver = stateManager.getDriver();
        const elementService = new ElementService(driver);
        await elementService.switchToParentFrame();
        return {
          content: [{ type: 'text', text: 'Switched to parent frame' }]
        };
      } catch (e) {
        return {
          content: [{ type: 'text', text: `Error switching to parent frame: ${(e as Error).message}` }]
        };
      }
    }
  );

  server.tool(
    "browser_file_upload",
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