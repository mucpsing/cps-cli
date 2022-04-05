#!/usr/bin/env node
//@ts-check

import path from "path";
import chalk from "chalk";
import { log } from "console";

import Config from "./commands/config.mjs";
import CommandsHandler from "./commandsHandler.mjs";
import Wellcome from "./wellcome.mjs";

async function main() {
  let config = await Config();

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
