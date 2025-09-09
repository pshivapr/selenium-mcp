#!/usr/bin/env node

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createSeleniumMcpServer } from './server.js';
import { logger } from './utils/logger.js';

async function main() {
  try {
    logger.info('🚀 Starting Selenium MCP Server...');

    // Create the server
    const server = createSeleniumMcpServer();

    if (!server.isReady()) {
      throw new Error('Server is not ready');
    }

    logger.debug('🔧 Creating STDIO transport...');
    // Create transport
    const transport = new StdioServerTransport();

    logger.debug('🔗 Connecting server to transport...');
    // Connect server to transport
    await server.getServer().connect(transport);

    logger.info('✅ Selenium MCP Server connected and ready');
  } catch (error) {
    logger.error('❌ Failed to start MCP server:', error);
    if (process.env.DEBUG && error instanceof Error) {
      logger.debug('Stack trace:', error.stack);
    }
    process.exit(1);
  }
}

// Add uncaught exception handler
process.on('uncaughtException', error => {
  logger.error('💥 Uncaught exception in main process:', error.message);
  if (process.env.DEBUG) {
    logger.debug('Exception stack:', error.stack);
  }
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('🚫 Unhandled rejection in main process:', reason);
  if (process.env.DEBUG) {
    logger.debug('Promise:', promise);
  }
  process.exit(1);
});

main().catch(error => {
  logger.error('❌ Fatal error in main:', error);
  if (process.env.DEBUG && error instanceof Error) {
    logger.debug('Fatal error stack:', error.stack);
  }
  process.exit(1);
});
