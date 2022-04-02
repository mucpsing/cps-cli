#!/usr/bin/env node
//@ts-check

import path from "path";
import chalk from "chalk";
import { log } from "console";

import commandsHandler from "./commandsHandler.mjs";
import wellcome from "./wellcome.mjs";

switch (process.argv.length) {
  case 1:
  case 2:
    wellcome();
    break;

  case 3:
  case 4:
    commandsHandler();
    break;
  default:
    wellcome();
}
