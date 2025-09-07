import { WebDriver } from 'selenium-webdriver';

export class CookieService {
  constructor(private driver: WebDriver) {}

  async getCookies(): Promise<string[]> {
    const cookies = await this.driver.manage().getCookies();
    return cookies.map(cookie => cookie.name);
  }

  async getCookieByName(name: string): Promise<any | null> {
    const cookie = await this.driver.manage().getCookie(name);
    return cookie ? { name: cookie.name, value: cookie.value } : null;
  }

  async addCookieByName(name: string, value: string): Promise<void> {
    await this.driver.manage().addCookie({ name, value });
  }

  async setCookie(cookie: string): Promise<void> {
    // Parse cookie string into an object
    const [nameValue, ...attributes] = cookie.split(';').map(part => part.trim());
    let name = '';
    let value = '';
    if (nameValue) {
      const parts = nameValue.split('=');
      name = parts[0] ?? '';
      value = parts[1] ?? '';
    }
    const cookieObj: any = { name, value };

    attributes.forEach(attr => {
      const [attrName, attrValue] = attr.split('=');
      if (!attrName) return;
      switch (attrName.toLowerCase()) {
        case 'name':
          cookieObj.name = attrValue;
          break;
        case 'domain':
          cookieObj.domain = attrValue;
          break;
        case 'path':
          cookieObj.path = attrValue;
          break;
        case 'expires':
          if (attrValue !== undefined) {
            cookieObj.expiry = Math.floor(new Date(attrValue).getTime() / 1000);
          }
          break;
        case 'secure':
          cookieObj.secure = true;
          break;
        case 'httponly':
          cookieObj.httpOnly = true;
          break;
      }
    });

    await this.driver.manage().addCookie(cookieObj);
  }

  async deleteCookie(name: string): Promise<void> {
    await this.driver.manage().deleteCookie(name);
  }

  async deleteAllCookies(): Promise<void> {
    await this.driver.manage().deleteAllCookies();
  }
}
