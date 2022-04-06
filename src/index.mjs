#!/usr/bin/env node
//@ts-check

import path from "path";
import { log } from "console";

import chalk from "chalk";
import fse from "fs-extra";

import Config from "./commands/config.mjs";
import CommandsHandler from "./commandsHandler.mjs";
import Wellcome from "./wellcome.mjs";
import { delay } from "./utils/index.mjs";

(async () => {
  const pkgPath = path.resolve(
    path.dirname(process.argv[1]),
    "../package.json"
  );

  const pkg = fse.readJSONSync(pkgPath);
  console.log("pkgPath: ", pkgPath);
  const ConfigManager = await Config();
  await delay(500);

  console.clear();
  log(
    chalk.cyan.bold(`${pkg.name}@${pkg.version}`),
    " --- ",
    chalk.yellow.bold(`最后更新: ${ConfigManager.config.modify_time}`)
  );

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
})();
