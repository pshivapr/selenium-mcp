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

  async getElementAttribute(params: LocatorParams & { attribute: string }): Promise<string | null> {
    const element = await this.findElement(params);
    return element.getAttribute(params.attribute);
  }

  async clearElement(params: LocatorParams): Promise<void> {
    const element = await this.findElement(params);
    await element.clear();
  } 

  async uploadFile(params: LocatorParams & { filePath: string }): Promise<void> {
    const element = await this.findElement(params);
    await element.sendKeys(params.filePath);
  }

  async isElementDisplayed(params: LocatorParams): Promise<boolean> {
    try {
      const element = await this.findElement(params);
      return element.isDisplayed();
    } catch {
      return false;
    }
  }

  async switchToFrame(params: LocatorParams): Promise<void> {
    const element = await this.findElement(params);
    await this.driver.switchTo().frame(element);
  }
}