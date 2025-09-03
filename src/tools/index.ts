import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StateManager } from '../utils/helpers.js';
import { registerBrowserTools } from './browserTools.js';
import { registerElementTools } from './elementTools.js';
import { registerActionTools } from './actionTools.js';
import { registerCookieTools } from './cookieTools.js';

export function registerAllTools(server: McpServer, stateManager: StateManager): void {
  registerBrowserTools(server, stateManager);
  registerElementTools(server, stateManager);
  registerActionTools(server, stateManager);
  registerCookieTools(server, stateManager);
}