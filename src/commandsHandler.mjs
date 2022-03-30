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
  template: template,
};

export default async (arg = undefined) => {
  const argv = process.argv;
  const command = argv[2].toString();

  if (!commands.hasOwnProperty(command)) {
    log("不支持的指令： ", command);
    // help()
  }

  switch (process.argv.length) {
    case 3:
      log(`当前要执行的${command}:`);
      commands[command].run();
      break;
    case 4:
      log(`当前要执行的${command}->${arg}`);
      commands[command].run(argv[3].toString());
      break;
  }
};
