import chalk from "chalk";
import { log } from "console";
import inquirer from "inquirer";
import git from "./git.mjs";

const msg = `cps-cli > [template]`;

const templateHandler = {
  git: git,
};

export default async (target = undefined) => {
  log(chalk.hex("#E438E6").bold(msg));

  if (!templateHandler.hasOwnProperty(target)) {
    log(chalk.hex("res").bold(`sorry, 不支持当前指令${target}`));
  } else {
    templateHandler[target]();
  }

  let answers = await inquirer.prompt([
    {
      type: "list",
      name: "template",
      message: chalk.bgCyan("选择需要的项目模板："),
      choices: templateHandler.keys(),
      default: 0,
    },
  ]);

  if (!answers) return log(chalk.red("无效的输入"));
  console.log("answers: ", answers);
};
