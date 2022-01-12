import chalk from "chalk";
import { log } from "console";
import inquirer from "inquirer";

export default async () => {
  let answers = await inquirer.prompt([
    {
      type: "list",
      name: "template",
      message: chalk.bgCyan("选择需要的模板："),
      choices: ["Electron+vue", "vue+Echarts"],
      default: 0,
    },
  ]);

  if (!answers) return log(chalk.red("无效的输入"));
  console.log("answers: ", answers);
};
