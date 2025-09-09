#!/usr/bin/env node

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createSeleniumMcpServer } from './server.js';
import { Logger, LogLevel } from './utils/logger.js';

// Configure logger for MCP stdio transport
Logger.configure({
  level: process.env.DEBUG ? LogLevel.DEBUG : LogLevel.INFO,
  timestamp: false, // MCP servers typically don't use timestamps
});

async function main() {
  try {
    Logger.info('🚀 Starting Selenium MCP Server...');

    // Create the server
    const server = createSeleniumMcpServer();

    if (!server.isReady()) {
      throw new Error('Server is not ready');
    }

    Logger.debug('🔧 Creating STDIO transport...');
    // Create transport
    const transport = new StdioServerTransport();

    Logger.debug('🔗 Connecting server to transport...');
    // Connect server to transport
    await server.getServer().connect(transport);

    Logger.info('✅ Selenium MCP Server connected and ready');
  } catch (error) {
    Logger.error('❌ Failed to start MCP server:', error);
    if (process.env.DEBUG && error instanceof Error) {
      Logger.debug('Stack trace:', error.stack);
    }
    process.exit(1);
  }
}

// Add uncaught exception handler
process.on('uncaughtException', error => {
  Logger.error('💥 Uncaught exception in main process:', error.message);
  if (process.env.DEBUG) {
    Logger.debug('Exception stack:', error.stack);
  }
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  Logger.error('🚫 Unhandled rejection in main process:', reason);
  if (process.env.DEBUG) {
    Logger.debug('Promise:', promise);
  }
  process.exit(1);
});

main().catch(error => {
  Logger.error('❌ Fatal error in main:', error);
  if (process.env.DEBUG && error instanceof Error) {
    Logger.debug('Fatal error stack:', error.stack);
  }
  process.exit(1);
});
