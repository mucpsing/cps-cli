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
import program from "commander";
import chalk from "chalk";
import create from "./create.mjs";

export default async () => {
  return new Promise(resolve => {
    program
      .command("create <name>")
      .description("创建项目")
      .option("-f, --force", "如果目录存在，则覆盖")
      .action((name, option) => {
        console.log("option: ", option);
        console.log("name: ", name);
        // create(name, option);
      });

    program.version("v0.0.1").usage("<> [option]");
    program.parse();
    resolve();
  });
};
