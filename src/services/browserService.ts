import { Builder, WebDriver } from 'selenium-webdriver';
import { Options as ChromeOptions } from 'selenium-webdriver/chrome.js';
import { Options as FirefoxOptions } from 'selenium-webdriver/firefox.js';
import { Options as EdgeOptions } from 'selenium-webdriver/edge.js';
import { Options as SafariOptions } from 'selenium-webdriver/safari.js';
import { BrowserOptions } from '../types/index.js';

export class BrowserService {
  static async createChromeDriver(options: BrowserOptions = {}): Promise<WebDriver> {
    const chromeOptions = new ChromeOptions();
    if (options.headless) {
      chromeOptions.addArguments('--headless=new');
    }
    if (options.arguments) {
      options.arguments.forEach(arg => chromeOptions.addArguments(arg));
    }
    return new Builder()
      .forBrowser('chrome')
      .setChromeOptions(chromeOptions)
      .build();
  }

  static async createEdgeDriver(options: BrowserOptions = {}): Promise<WebDriver> {
    const edgeOptions = new EdgeOptions();
    if (options.headless) {
      edgeOptions.addArguments('--headless=new');
    }
    if (options.arguments) {
      options.arguments.forEach(arg => edgeOptions.addArguments(arg));
    }
    return new Builder()
      .forBrowser('edge')
      .setEdgeOptions(edgeOptions)
      .build();
  }

  static async createFirefoxDriver(options: BrowserOptions = {}): Promise<WebDriver> {
    const firefoxOptions = new FirefoxOptions();
    if (options.headless) {
      firefoxOptions.addArguments('--headless');
    }
    if (options.arguments) {
      options.arguments.forEach(arg => firefoxOptions.addArguments(arg));
    }
    return new Builder()
      .forBrowser('firefox')
      .setFirefoxOptions(firefoxOptions)
      .build();
  }

  static async createSafariDriver(): Promise<WebDriver> {
    const safariOptions = new SafariOptions();
    return new Builder()
      .forBrowser('safari')
      .setSafariOptions(safariOptions)
      .build();
  }

  static async createDriver(browser: 'chrome' | 'firefox' | 'edge' | 'safari', options: BrowserOptions = {}): Promise<WebDriver> {
    switch (browser) {
      case 'chrome':
        return this.createChromeDriver(options);
      case 'edge':
        return this.createEdgeDriver(options);
      case 'firefox':
        return this.createFirefoxDriver(options);
      case 'safari':
        return this.createSafariDriver();
      default:
        throw new Error(`Unsupported browser: ${browser}`);
    }
  }
}