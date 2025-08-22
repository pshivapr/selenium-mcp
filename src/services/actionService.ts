import { until, WebDriver, WebElement } from 'selenium-webdriver';
import { Select } from 'selenium-webdriver/lib/select.js';
import { LocatorFactory } from '../utils/locators.js';
import { LocatorParams } from '../types/index.js';

export class ActionService {
  constructor(private driver: WebDriver) { }

  async hoverOverElement(params: LocatorParams): Promise<void> {
    const locator = LocatorFactory.createLocator(params.by, params.value);
    const element = await this.driver.wait(until.elementLocated(locator), params.timeout || 15000);
    const actions = this.driver.actions({ bridge: true });
    await actions.move({ origin: element }).perform();
  }

  async waitForElement(params: LocatorParams): Promise<WebElement> {
    const locator = LocatorFactory.createLocator(params.by, params.value);
    return this.driver.wait(until.elementLocated(locator), params.timeout || 15000);
  }

  async dragAndDrop(sourceParams: LocatorParams, targetParams: LocatorParams): Promise<void> {
    const sourceLocator = LocatorFactory.createLocator(sourceParams.by, sourceParams.value);
    const targetLocator = LocatorFactory.createLocator(targetParams.by, targetParams.value);

    const sourceElement = await this.driver.wait(until.elementLocated(sourceLocator), sourceParams.timeout || 15000);
    const targetElement = await this.driver.wait(until.elementLocated(targetLocator), targetParams.timeout || 15000);

    const actions = this.driver.actions({ bridge: true });
    await actions.dragAndDrop(sourceElement, targetElement).perform();
  }

  async doubleClickElement(params: LocatorParams): Promise<void> {
    const locator = LocatorFactory.createLocator(params.by, params.value);
    const element = await this.driver.wait(until.elementLocated(locator), params.timeout || 15000);
    const actions = this.driver.actions({ bridge: true });
    await actions.doubleClick(element).perform();
  }

  async rightClickElement(params: LocatorParams): Promise<void> {
    const locator = LocatorFactory.createLocator(params.by, params.value);
    const element = await this.driver.wait(until.elementLocated(locator), params.timeout || 15000);
    const actions = this.driver.actions({ bridge: true });
    await actions.contextClick(element).perform();
  }

  async selectDropdownByText(params: LocatorParams & { text: string }): Promise<void> {
    const locator = LocatorFactory.createLocator(params.by, params.value);
    const selectElement = await this.driver.wait(until.elementLocated(locator), params.timeout || 15000);
    const select = new Select(selectElement);
    await select.selectByVisibleText(params.text);
  }

  async selectDropdownByValue(params: LocatorParams & { value: string }): Promise<void> {
    const locator = LocatorFactory.createLocator(params.by, params.value);
    const selectElement = await this.driver.wait(until.elementLocated(locator), params.timeout || 15000);
    const select = new Select(selectElement);
    await select.selectByValue(params.value);
  }

  async pressKey(key: string): Promise<void> {
    const actions = this.driver.actions({ bridge: true });
    await actions.keyDown(key).keyUp(key).perform();
  }

  async takeScreenshot(): Promise<string> {
    return this.driver.takeScreenshot();
  }
}