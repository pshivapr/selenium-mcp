#!/usr/bin/env node

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createSeleniumMcpServer } from './server.js';

async function main() {
  try {
    // Create the server
    const server = createSeleniumMcpServer();

    // Create transport
    const transport = new StdioServerTransport();

    // Connect server to transport
    await server.getServer().connect(transport);

    console.error('🚀 Selenium MCP Server started successfully');
  } catch (error) {
    console.error('❌ Failed to start MCP server:', error);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
