import { WebDriver } from 'selenium-webdriver';
import { ServerState } from '../types/index.js';

export class StateManager {
  private state: ServerState;

  constructor() {
    this.state = {
      drivers: new Map(),
      currentSession: null,
    };
  }

  getState(): ServerState {
    return this.state;
  }

  getDriver(): WebDriver {
    if (!this.state.currentSession) {
      throw new Error('No active browser session');
    }
    const driver = this.state.drivers.get(this.state.currentSession);
    if (!driver) {
      throw new Error('No active browser session');
    }
    return driver;
  }

  setCurrentSession(sessionId: string): void {
    this.state.currentSession = sessionId;
  }

  addDriver(sessionId: string, driver: WebDriver): void {
    this.state.drivers.set(sessionId, driver);
  }

  removeDriver(sessionId: string): void {
    this.state.drivers.delete(sessionId);
  }

  clearDrivers(): void {
    this.state.drivers.clear();
  }

  getCurrentSession(): string | null {
    return this.state.currentSession;
  }

  resetCurrentSession(): void {
    this.state.currentSession = null;
  }
}
