#!/usr/bin/env node
//@ts-check
import path from "path";
import chalk from "chalk";
import { log } from "console";

import wellcome from "../lib/wellcome.mjs";

/*
 *@type {number}
 */
const __dirname = path.dirname(import.meta.url);
const __file__ = path.basename(import.meta.url);
console.log("__filename: ", __file__);

log(chalk.bgBlue(`当前工作目录: ${__dirname}`));

await wellcome();
