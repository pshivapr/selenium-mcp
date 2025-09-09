#!/usr/bin/env node

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createSeleniumMcpServer } from './server.js';

async function main() {
  try {
    console.error('🚀 Starting Selenium MCP Server...');

    // Create the server
    const server = createSeleniumMcpServer();

    if (!server.isReady()) {
      throw new Error('Server is not ready');
    }

    // Create transport
    const transport = new StdioServerTransport();

    // Connect server to transport
    await server.getServer().connect(transport);

    console.error('✅ Selenium MCP Server connected and ready');
  } catch (error) {
    console.error('❌ Failed to start MCP server:', error);
    console.error('Stack trace:', (error as Error).stack);
    process.exit(1);
  }
}

// Add uncaught exception handler
process.on('uncaughtException', error => {
  console.error('💥 Uncaught exception in main process:', error);
  process.exit(1);
});

process.on('unhandledRejection', reason => {
  console.error('🚫 Unhandled rejection in main process:', reason);
  process.exit(1);
});

main().catch(error => {
  console.error('❌ Fatal error in main:', error);
  process.exit(1);
});
