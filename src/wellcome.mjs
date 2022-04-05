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

import { log } from "console";

import inquirer from "inquirer";
import chalk from "chalk";

import tempalte from "./commands/template.mjs";

const commands = { template: tempalte };
const VERSION = "v1.1.0";

const Wellcome = async () => {
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
          name: "1. 常用项目模板下载",
          value: "template",
        },
        {
          name: "2. 常用脚本下载",
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

  if (commands[answers]) {
    commands[answers]();
  } else {
    log(`${chalk.red("无效选择")}`);
  }
};

export default Wellcome;

(async () => {
  Wellcome();
})();
