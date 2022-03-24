/*!
 * @Author: CPS
 * @email: 373704015@qq.com
 * @Date: 2022-03-22 16:39:39.233051
 * @Last Modified by: CPS
 * @Last Modified time: 2022-03-22 16:39:39.238039
 * @Projectname
 * @file_path "W:\CPS\MyProject\demo\cps-cli\src\template\git"
 * @Filename "git"
 * @Description: 功能描述
 */

"use strict";
import chalk from "chalk";
import { log } from "console";
import inquirer from "inquirer";

const msg = `选择需要创建的脚本`;
log(chalk.hex("#E438E6").bold(msg));

export default async () => {
  let answers = await inquirer.prompt([
    {
      type: "list",
      name: "template",
      message: chalk.bgCyan("选择需要的项目模板："),
      choices: ['all', ],
      default: 0,
    },
  ]);

  if (!answers) return log(chalk.red("无效的输入"));
  console.log("answers: ", answers);
};
