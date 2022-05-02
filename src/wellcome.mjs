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

import TempalteCommand from "./commands/template.mjs";

const Wellcome = async ctx => {
  const commands = { template: TempalteCommand };
  const config = ctx.configManager.config;

  console.clear();
  log(chalk.cyan.bold(`cps-cli@${ctx.pkg.version}`), " --- ", chalk.yellow.bold(`最后更新: ${config["template"]["org_modify_time"]}`));

  let { welcome: answers } = await inquirer.prompt([
    {
      type: "rawlist",
      name: "welcome",
      message: `${chalk.bgGreen("选择功能")}: (Use arrow keys)`,
      choices: [
        {
          name: "常用项目模板下载",
          value: "template",
        },
        {
          name: "常用脚本下载",
          value: "add",
        },
        {
          name: "自定义",
          value: "config",
        },
        {
          name: "帮助",
          value: "help",
        },
      ],
      default: 0,
    },
  ]);

  if (commands[answers]) {
    commands[answers](ctx);
  } else {
    log(`${chalk.red("无效选择")}`);
  }
};

export default Wellcome;

// (async () => {
//   Wellcome();
// })();
