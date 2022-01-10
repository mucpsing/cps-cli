
#!/usr/bin/env node
import inquirer from "inquirer";
import wellcome from "./wellcome.mjs";
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

await main();
