/*!
 * @Author: CPS
 * @email: 373704015@qq.com
 * @Date: 2022-07-17 11:50:27.662818
 * @Last Modified by: CPS
 * @Last Modified time: 2022-07-17 11:50:27.662818
 * @Projectname
 * @file_path "D:\CPS\MyProject\Projects_Personal\cps-cli\cps-cli\src\commands"
 * @Filename "remove.mjs"
 * @Description: 功能描述
 */

import path from "path";
import { log } from "console";

import inquirer from "inquirer";

import { shell } from "../utils/shell.mjs";

const main = async ctx => {
  console.log("argvs: ", argvs);
};

const userInputArgvs = async () => {
  const answer = await inquirer.prompt([
    {
      name: "res",
      type: "rawlist",
      message: chalk.bgCyan("请输入要处理的目录或者文件路径："),
      choices: selection,
      default: 0,
    },
  ]);
  return answer["res"];
};

if (process.mainModule === undefined) {
  // 当前为主模块
  console.log(123123123123);

  if (!process.argv[2]) {
  }

  const target_path = process.argv[2];

  console.log("target_path: ", target_path);
}

export default main;
