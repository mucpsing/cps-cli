#!/usr/bin/env node
//@ts-check

import path from "path";
import { log } from "console";

import chalk from "chalk";
import fse from "fs-extra";

import Config from "./commands/config.mjs";
import CommandsHandler from "./commandsHandler.mjs";
import Wellcome from "./wellcome.mjs";

const pkg = fse.readJSONSync("../package.json");

async function main() {
  const ConfigManager = await Config();
  console.clear();
  log(chalk.cyan.bold(`${pkg.name}@${pkg.version}`), " --- ", chalk.yellow.bold(`最后更新: ${ConfigManager.config.modify_time}`));

  switch (process.argv.length) {
    case 1:
    case 2:
      Wellcome();
      break;

    case 3:
    case 4:
      CommandsHandler();
      break;
    default:
      Wellcome();
  }
}

main();
