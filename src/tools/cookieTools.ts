import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StateManager } from '../utils/helpers.js';
import { CookieService } from '../services/cookieService.js';
import { z } from 'zod';

export function registerCookieTools(server: McpServer, stateManager: StateManager) {
    server.tool(
        "browser_get_cookies",
        "Get all cookies",
        {},
        async () => {
            const driver = stateManager.getDriver();
            const cookieService = new CookieService(driver);
            const cookies = await cookieService.getCookies();
            return {
                content: [{ type: 'text', text: `Cookies: ${cookies.join(', ')}` }]
            };
        }
    );

    server.tool(
        "browser_get_cookie_by_name",
        "Get a cookie by name",
        {
            name: z.string().describe("Name of the cookie to get")
        },
        async ({ name }) => {
            const driver = stateManager.getDriver();
            const cookieService = new CookieService(driver);
            const cookieValue = await cookieService.getCookieByName(name);
            return {
                content: [{ type: 'text', text: `Cookie: ${cookieValue}` }]
            };
        }
    );

    server.tool(
        "browser_add_cookie_by_name",
        "Add a cookie to the browser",
        {
            name: z.string().describe("Name of the cookie to add"),
            value: z.string().min(1).max(4096).describe("Value of the cookie to add")
        },
        async ({ name, value }) => {
            const driver = stateManager.getDriver();
            const cookieService = new CookieService(driver);
            await cookieService.addCookieByName(name, value);
            return {
                content: [{ type: 'text', text: `Added cookie: ${name}` }]
            };
        }
    );

    server.tool(
        "browser_set_cookie_object",
        "Set a cookie in the browser",
        {
            cookie: z.string().min(1).max(4096).describe("Cookie string to set, e.g. 'name=value; Path=/; HttpOnly'")
        },
        async ({ cookie }) => {
            const driver = stateManager.getDriver();
            const cookieService = new CookieService(driver);
            await cookieService.setCookie(cookie);
            return {
                content: [{ type: 'text', text: `Set cookie: ${cookie}` }]
            };
        }
    );

    server.tool(
        "browser_delete_cookie",
        "Delete a cookie from the browser",
        {
            name: z.string().describe("Name of the cookie to delete")
        },
        async ({ name }) => {
            const driver = stateManager.getDriver();
            const cookieService = new CookieService(driver);
            await cookieService.deleteCookie(name);
            return {
                content: [{ type: 'text', text: `Deleted cookie: ${name}` }]
            };
        }
    );

    server.tool(
        "browser_delete_cookies",
        "Delete cookies from the browser",
        {},
        async () => {
            const driver = stateManager.getDriver();
            const cookieService = new CookieService(driver);
            await cookieService.deleteAllCookies();
            return {
                content: [{ type: 'text', text: 'Deleted all cookies' }]
            };
        }
    );
}