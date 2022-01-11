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

export default async (welcomeMsg = "") => {
  let { template: answers } = await inquirer.prompt([
    {
      type: "list",
      name: "template",
      message: chalk.bgGreen(`欢迎使用cps-cli`),
      choices: [
        {
          name: "1、下载常用模板",
          value: "template",
        },
        {
          name: "2、其他功能",
          value: "other",
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
