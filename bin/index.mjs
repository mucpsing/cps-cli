#!/usr/bin/env node
//@ts-check

import path from "path";
import chalk from "chalk";
import { log } from "console";

import wellcome from "../lib/wellcome.mjs";

const token = "";

/*
 *@type {string}
 */
// const meta = new URL(import.meta.url);
// console.log("meta: ", meta);
// log(chalk.bgBlue(`当前工作目录: ${import.meta.url}`));

await wellcome();
