import chalk from "chalk";
import { log } from "console";
import inquirer from "inquirer";

const COMMAND_NAME = "init project";
const packageManager = {
  yarn: ["yarn"],
  npm: ["npm", "i"],
};

const main = async () => {
  const answer = await inquirer.prompt([
    {
      type: "list",
      name: COMMAND_NAME,
      message: chalk.bgCyan("是否安装依赖(yarn/npm i)"),
      choices: ["yarn", "npm", "exit"],
      default: 0,
    },
  ]);

  if (packageManager.hasOwnProperty(answer[COMMAND_NAME])) {
    log(packageManager[answer[COMMAND_NAME]]);
  }
};

// main();

export default main;
