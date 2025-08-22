import { By, Locator } from 'selenium-webdriver';
import { LocatorStrategy } from '../types/index.js';

export class LocatorFactory {
  static createLocator(by: LocatorStrategy, value: string): Locator {
    switch (by.toLowerCase()) {
      case 'id': return By.id(value);
      case 'css': return By.css(value);
      case 'xpath': return By.xpath(value);
      case 'name': return By.name(value);
      case 'tag': return By.css(value);
      case 'class': return By.className(value);
      case 'link': return By.linkText(value);
      case 'partialLink': return By.partialLinkText(value);
      default: throw new Error(`Unsupported locator strategy: ${by}`);
    }
  }
}