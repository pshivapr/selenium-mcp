import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { createSeleniumMcpServer } from '../dist/server.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const configPath = join(__dirname, '..', 'version.config.json');

let versionConfig;
const configContent = readFileSync(configPath, 'utf8');
versionConfig = JSON.parse(configContent);

describe('Selenium MCP Server - Health Check', () => {
  let server;

  beforeEach(async () => {
    server = createSeleniumMcpServer({
      shutdownTimeout: 1000, // Shorter timeout for tests
    });
  });

  afterEach(async () => {
    if (server) {
      try {
        await server.stop();
      } catch (error) {
        // Ignore cleanup errors in tests
        console.warn('Test cleanup warning:', error.message);
      }
    }
  });

  test('should return healthy status on creation', () => {
    const health = server.getHealthStatus();

    assert.ok(health, 'Health status should be defined');
    assert.strictEqual(health.status, 'healthy');
    assert.strictEqual(health.serverName, versionConfig.name);
    assert.strictEqual(health.version, versionConfig.version);
    assert.strictEqual(typeof health.uptime, 'number');
    assert.strictEqual(health.activeSessions, 0);
  });

  test('should provide server statistics', () => {
    const stats = server.getStats();

    assert.ok(stats, 'Stats should be defined');
    assert.ok(stats.server, 'Server stats should be defined');
    assert.ok(stats.sessions, 'Session stats should be defined');

    // Server stats
    assert.strictEqual(stats.server.name, versionConfig.name);
    assert.strictEqual(stats.server.version, versionConfig.version);
    assert.strictEqual(stats.server.isShuttingDown, false);
    assert.strictEqual(typeof stats.server.uptime, 'number');
    assert.ok(stats.server.memoryUsage, 'Memory usage should be defined');

    // Session stats
    assert.strictEqual(stats.sessions.total, 0);
    assert.strictEqual(stats.sessions.active, 0);
    assert.ok(Array.isArray(stats.sessions.sessionIds));
    assert.strictEqual(stats.sessions.sessionIds.length, 0);
    assert.strictEqual(stats.sessions.currentSession, null);
  });

  test('should maintain health status after start', async () => {
    await server.start();

    const health = server.getHealthStatus();
    assert.strictEqual(health.status, 'healthy');
    assert.strictEqual(health.activeSessions, 0);
  });

  test('should maintain health status after stop', async () => {
    await server.start();
    await server.stop();

    const health = server.getHealthStatus();
    assert.strictEqual(health.status, 'healthy');
    assert.strictEqual(health.activeSessions, 0);
  });

  test('should handle multiple start/stop cycles', async () => {
    // First cycle
    await server.start();
    assert.strictEqual(server.getHealthStatus().status, 'healthy');
    await server.stop();

    // Second cycle
    await server.start();
    assert.strictEqual(server.getHealthStatus().status, 'healthy');
    await server.stop();

    const finalHealth = server.getHealthStatus();
    assert.strictEqual(finalHealth.status, 'healthy');
  });

  test('should show increasing uptime over time', async () => {
    const initialHealth = server.getHealthStatus();
    const initialUptime = initialHealth.uptime;

    // Wait for a short time
    await new Promise(resolve => setTimeout(resolve, 100));

    const laterHealth = server.getHealthStatus();
    assert.ok(laterHealth.uptime > initialUptime, 'Uptime should increase over time');
  });

  test('should consistently return same server info', () => {
    const health1 = server.getHealthStatus();
    const health2 = server.getHealthStatus();

    assert.strictEqual(health1.serverName, health2.serverName);
    assert.strictEqual(health1.version, health2.version);
    assert.strictEqual(health1.status, health2.status);
    assert.strictEqual(health1.activeSessions, health2.activeSessions);
  });

  test('should handle rapid health status calls', () => {
    const healthChecks = [];

    for (let i = 0; i < 10; i++) {
      healthChecks.push(server.getHealthStatus());
    }

    healthChecks.forEach((health, index) => {
      assert.strictEqual(health.status, 'healthy', `Health check ${index} should be healthy`);
      assert.strictEqual(health.activeSessions, 0, `Health check ${index} should have 0 active sessions`);
    });
  });

  test('should create healthy server with factory function', () => {
    const testServer = createSeleniumMcpServer();

    const health = testServer.getHealthStatus();
    assert.strictEqual(health.status, 'healthy');
    assert.strictEqual(health.activeSessions, 0);

    // Cleanup
    testServer.stop().catch(() => {
      // Ignore cleanup errors
    });
  });

  test('should create healthy server with custom options', () => {
    const testServer = createSeleniumMcpServer({
      autoStart: false,
      shutdownTimeout: 2000,
    });

    const health = testServer.getHealthStatus();
    assert.strictEqual(health.status, 'healthy');

    // Cleanup
    testServer.stop().catch(() => {
      // Ignore cleanup errors
    });
  });
});
