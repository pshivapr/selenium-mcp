import { WebDriver, WebElement, until } from 'selenium-webdriver';
import { LocatorFactory } from '../utils/locators.js';
import { LocatorParams } from '../types/index.js';

export class ElementService {
  constructor(private driver: WebDriver) { }

  async findElement(params: LocatorParams): Promise<WebElement> {
    const locator = LocatorFactory.createLocator(params.by, params.value);
    return this.driver.wait(until.elementLocated(locator), params.timeout || 15000);
  }

  async getElementText(params: LocatorParams): Promise<string> {
    const element = await this.findElement(params);
    return element.getText();
  }

  async clickElement(params: LocatorParams): Promise<void> {
    const element = await this.findElement(params);
    await element.click();
  }

  async sendKeysToElement(params: LocatorParams & { text: string }): Promise<void> {
    const element = await this.findElement(params);
    await element.clear();
    await element.sendKeys(params.text);
  }

  async uploadFile(params: LocatorParams & { filePath: string }): Promise<void> {
    const element = await this.findElement(params);
    await element.sendKeys(params.filePath);
  }
}