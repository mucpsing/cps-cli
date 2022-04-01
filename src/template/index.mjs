import path from "path";
import { log } from "console";

import ora from "ora";
import chalk from "chalk";
import inquirer from "inquirer";

import { getOrgInfo } from "../utils/gitee-api.mjs";
import download from "../utils/gitee-download.mjs";
import { delay } from "../utils/index.mjs";

const ORG_NAME = "cps-cli-template";

export default async (input = undefined) => {
  const spinnerDiscardingStdin = ora({ text: "获取远程数据中..." });

  spinnerDiscardingStdin.start();

  const { success, data } = await getOrgInfo(ORG_NAME);
  if (!success) {
    spinnerDiscardingStdin.text = chalk.red("获取远程数据失败！");
    await delay(1000);
    spinnerDiscardingStdin.fail(err);
    return;
  }

  spinnerDiscardingStdin.succeed(chalk.green("获取远程数据成功！"));

  const templateHandler = data;

  // 没有输入则让用户选择
  if (!input) {
    const answer = await inquirer.prompt([
      {
        type: "list",
        name: "res",
        message: chalk.bgCyan("选择需要的项目模板："),
        choices: Object.keys(templateHandler),
        default: 0,
      },
    ]);

    input = answer["res"];
  }

  if (!templateHandler.hasOwnProperty(input))
    log(chalk.hex("res").bold(`sorry, 不支持当前指令${input}`));

  const repoName = input;
  const repoUrl = `${templateHandler[input].namespace.html_url}/${input}`;
  const dest = path.join(process.cwd(), input);

  try {
    const res = await download(repoUrl, dest, { clone: true });

    if (res.success) {
      log(chalk.green(`下载[${input}]模板完成！`));

      process.exit(1);
    } else {
      log(chalk.red(`下载[${input}]模板失败：`));
      log(res.err);

      process.exit(0);
    }
  } catch (err) {
    log(chalk.red(`下载[${input}]模板完成！`));
    console.error(err);
    return;
  }
};
