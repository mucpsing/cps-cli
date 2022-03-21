/*!
 * @Author: CPS
 * @email: 373704015@qq.com
 * @Date: 2022-03-21 23:53:27.538412
 * @Last Modified by: CPS
 * @Last Modified time: 2022-03-21 23:53:27.538412
 * @Projectname
 * @file_path "D:\CPS\MyProject\demo\cps-cli\src"
 * @Filename "commandsHandler.mjs"
 * @Description: 功能描述
 */

"use strict";
import template from "./template/index.mjs";

let commands = {
  template: {
    run: template,
    args: {
      node: {},
      python: {},
      electron: {},
      vue: {},
    },
  },
};

export default async () => {
  const argv = process.argv;
  const command = argv[2].toString();
  const arg = argv[3].toString();

  if (!commands.hasOwnProperty(command)) {
    console.log("不支持的指令： ", command);
    // help()
  }

  if (!commands[command]["args"].hasOwnProperty(arg)) {
    console.log("不支持的参数： ", arg);
    // help()
  }

  console.log(`当前要执行的${command}->${arg}`);
};
