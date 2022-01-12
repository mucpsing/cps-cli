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

/*webcome msg*/
// log(chalk.hex("#85E1E6").underline.bold(`cps-cli ${VERSION}`));
log(chalk.hex("#85E1E6").bold(`cps-cli ${VERSION}`));

export default async (welcomeMsg = "") => {
  let { welcome: answers } = await inquirer.prompt([
    {
      type: "list",
      name: "welcome",
      message: chalk.bgGreen(`选择功能：`),
      choices: [
        {
          name: "1、常用项目模板",
          value: "template",
        },
        {
          name: "2、其他功能",
          value: "other",
        },
        {
          name: "3、帮助",
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
