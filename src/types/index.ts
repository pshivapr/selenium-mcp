import { WebDriver } from 'selenium-webdriver';
import { z } from 'zod';

export interface ServerState {
  drivers: Map<string, WebDriver>;
  currentSession: string | null;
}

export type LocatorStrategy = 'id' | 'css' | 'xpath' | 'name' | 'tag' | 'class' | 'link' | 'partialLink';

export interface LocatorParams {
  by: LocatorStrategy;
  value: string;
  timeout?: number;
}

export interface BrowserOptions {
  headless?: boolean;
  arguments?: string[];
}

export const browserOptionsSchema = z
  .object({
    headless: z.boolean().optional().describe('Run browser in headless mode'),
    arguments: z.array(z.string()).optional().describe('Additional browser arguments'),
  })
  .optional();

export const locatorSchema = {
  by: z
    .enum(['id', 'css', 'xpath', 'name', 'tag', 'class', 'link', 'partialLink'])
    .describe('Locator strategy to find element'),
  value: z.string().describe('Value for the locator strategy'),
  timeout: z.number().optional().describe('Maximum time to wait for element in milliseconds'),
};
