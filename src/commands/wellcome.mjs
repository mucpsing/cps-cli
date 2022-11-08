/*!
 * @Author: CPS
 * @email: 373704015@qq.com
 * @Date:
 * @Last Modified by: CPS
 * @Last Modified time: 2022-01-10 16:12:33.677595
 * @Projectname
 * @file_path "W:\CPS\MyProject\demo\cps-cli\src"
 * @Filename "wellcome.mjs"
 * @Description: 用户交互视图
 */

import { log } from "console";

import inquirer from "inquirer";
import chalk from "chalk";

import tree from "./tree.mjs";
import template from "./template.mjs";
import server from "./server.mjs";
import test from "./test.mjs";

const Wellcome = async ctx => {
  const commands = { template, server, test, tree };
  const config = ctx.configManager.config;

  console.clear();
  log(
    chalk.cyan.bold(`cps-cli@${ctx.pkg.version}`),
    " --- ",
    chalk.yellow.bold(`最后更新: ${config["template"]["org_modify_time"]}`)
  );

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
          name: "开启本地静态服务器",
          value: "server",
        },
        {
          name: "生成目录树",
          value: "tree",
        },
        {
          name: "测试",
          value: "test",
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
