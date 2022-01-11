/*!
 * @Author: CPS
 * @email: 373704015@qq.com
 * @Date:
 * @Last Modified by: CPS
 * @Last Modified time: 2022-01-10 16:12:33.677595
 * @Projectname
 * @file_path "W:\CPS\MyProject\demo\cps-cli\src"
 * @Filename "wellcome.mjs"
 * @Description: 功能描述
 */

"use strict";
import inquirer from "inquirer";
import chalk from "chalk";
import { log } from "console";
import { get__dirname, get__filename } from "./utils.mjs";

console.log("process: ", process.env);
export default async (welcomeMsg = "") => {
  if (welcomeMsg == "") {
    log(chalk.bgGreen(`欢迎使用cps-cli`));
  }

  inquirer
    .prompt([
      {
        type: "list",
        name: "template",
        message: "请输入接下来你要？",
        choices: ["1、下载常用模板", "2、其他功能"],
        default: 0,
      },
    ])
    .then(answers => {
      console.log("当前选择： ", answers);
    });
};
