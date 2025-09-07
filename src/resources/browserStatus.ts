import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StateManager } from '../utils/helpers.js';

export function registerBrowserStatusResource(server: any, stateManager: StateManager): void {
  server.resource(
    'browser-status',
    new ResourceTemplate('browser-status://current', { list: undefined }),
    async (uri: any) => ({
      contents: [
        {
          uri: uri.href,
          text: stateManager.getCurrentSession()
            ? `Active browser session: ${stateManager.getCurrentSession()}`
            : 'No active browser session',
        },
      ],
    })
  );
}
