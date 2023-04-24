import type { ConfigManager } from './commands/config.mjs';
import type * as utils from './utils/index.mjs';
import type { Command } from 'commander';

export interface PackageJson {
  [key: string]: any;
}

export interface Ctx {
  configManager: ConfigManager;
  pkg: PackageJson;
  utils: typeof utils;
  argv: string[];
  program: Command;
}
