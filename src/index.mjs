/*!/usr/bin/env node
 * @Author: CPS
 * @email: 373704015@qq.com
 * @Date:
 * @Last Modified by: CPS
 * @Last Modified time: 2022-01-10 16:12:33.677595
 * @Projectname
 * @file_path "W:\CPS\MyProject\demo\cps-cli\src"
 * @Filename "src"
 * @Description: 功能描述
 */

import inquirer from "inquirer";
import "./wellcome.mjs";
import path from "path";

const __dirname = path.dirname(import.meta.url);

async function main() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "code1",
        message: "请输入接下来你要？",
        choices: ["1", "2"],
        default: "1",
      },
      {
        type: "list",
        name: "code2",
        message: "请输入接下来你要？",
        choices: ["1", "2"],
        default: "1",
      },
    ])
    .then(answers => {
      console.log("当前选择： ", answers);
    });
}

// await main();
