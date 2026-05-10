import { Command } from 'commander';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const CONFIG_DIR = join(homedir(), '.gitinsight');
const CONFIG_FILE = join(CONFIG_DIR, 'config.json');

export interface Config {
  token?: string;
  defaultFormat?: 'html' | 'json';
  outputDir?: string;
}

function ensureConfigDir() {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

export function getConfig(): Config {
  try {
    return JSON.parse(readFileSync(CONFIG_FILE, 'utf-8'));
  } catch {
    return {};
  }
}

export function setConfig(updates: Partial<Config>) {
  ensureConfigDir();
  const current = getConfig();
  const merged = { ...current, ...updates };
  writeFileSync(CONFIG_FILE, JSON.stringify(merged, null, 2));
}

export const configCommand = new Command('config')
  .description('Manage GitInsight configuration')
  .addCommand(
    new Command('set')
      .argument('<key>', 'Configuration key (token, defaultFormat, outputDir)')
      .argument('<value>', 'Configuration value')
      .action((key: string, value: string) => {
        const validKeys = ['token', 'defaultFormat', 'outputDir'];
        if (!validKeys.includes(key)) {
          console.error(`Invalid key: "${key}". Valid keys: ${validKeys.join(', ')}`);
          process.exit(1);
        }
        setConfig({ [key]: value } as any);
        console.log(`Set ${key} successfully.`);
      })
  )
  .addCommand(
    new Command('get')
      .argument('[key]', 'Configuration key to view')
      .action((key?: string) => {
        const config = getConfig();
        if (key) {
          const value = (config as any)[key];
          if (value !== undefined) {
            console.log(key === 'token' ? '***' + String(value).slice(-4) : value);
          } else {
            console.log(`Key "${key}" not set.`);
          }
        } else {
          const display = { ...config };
          if (display.token) display.token = ('***' + display.token.slice(-4)) as any;
          console.log(JSON.stringify(display, null, 2));
        }
      })
  );
