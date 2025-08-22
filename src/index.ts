#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SeleniumMcpServer } from './server.js';

async function main() {
    const seleniumServer = new SeleniumMcpServer();
    seleniumServer.initialize();

    const transport = new StdioServerTransport();
    await seleniumServer.getServer().connect(transport);

    console.error("Selenium MCP Server started and listening on stdio");
}

main().catch(error => {
    console.error("Failed to start server:", error);
    process.exit(1);
});