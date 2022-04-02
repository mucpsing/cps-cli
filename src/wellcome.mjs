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
import tempalte from "./template/index.mjs";

const selector = { template: tempalte };
const VERSION = "v1.0.0";

export default async (welcomeMsg = "") => {
  console.clear();
  let msg = `cps-cli@${VERSION}`;

  log(chalk.cyan.bold(msg));

  let { welcome: answers } = await inquirer.prompt([
    {
      type: "list",
      name: "welcome",
      message: chalk.bgGreen(`选择功能：`),
      choices: [
        {
          name: "1. 常用项目模板",
          value: "template",
        },
        {
          name: "2. 添加常用脚本",
          value: "add",
        },
        {
          name: "3. 自定义",
          value: "config",
        },
        {
          name: "4. 帮助",
          value: "help",
        },
      ],
      default: 0,
    },
  ]);

  if (!answers) return;

  if (selector[answers]) {
    selector[answers]();
  } else {
    log(`${chalk.red("无效选择")}`);
  }
};
