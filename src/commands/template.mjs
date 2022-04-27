import path from "path";
import { log } from "console";

import ora from "ora";
import chalk from "chalk";
import inquirer from "inquirer";
import fse from "fs-extra";

import Download from "../utils/gitee-download.mjs";
import { delay, ifDirExists, Input } from "../utils/index.mjs";
import { EMPTY_STRING } from "../env.mjs";
import ConfigMamager from "./config.mjs";

async function userSelectRepo(selection) {
  const answer = await inquirer.prompt([
    {
      name: "res",
      type: "rawlist",
      message: chalk.bgCyan("选择需要的项目模板："),
      choices: selection,
      default: 0,
    },
  ]);
  return answer["res"];
}

export default async (repoName = EMPTY_STRING) => {
  let Config = await ConfigMamager();
  const display = ora();

  const data = Config.orgInfo;
  const org_url = Config.config["org_url"];

  log(`   目标组织仓库:  ${chalk.yellow.bold(org_url)}`);
  log(`   当前工作目录:  ${chalk.yellow.bold(process.cwd())}`);

  // 没有指定仓库，列出所有仓库名称，让用户选择
  if (repoName == "" || typeof repoName == "boolean") {
    repoName = await userSelectRepo(Object.keys(data));
  } else {
    if (!data.hasOwnProperty(repoName)) {
      log(
        chalk.red.bold(`没有找到相应的仓库：${repoName}，请重新选择`)
      );
      repoName = await userSelectRepo(Object.keys(data));
    }
  }

  const repoUrl = `${data[repoName].namespace.html_url}/${repoName}`;
  const projectName = await Input(`请输入项目名称:`, repoName);
  const dest = path.join(process.cwd(), projectName);

  await ifDirExists(dest);

  try {
    display.start("开始下载项目模板...");
    await delay(500);
    const res = await Download(repoUrl, dest, { clone: true });

    if (res.success) {
      display.succeed(chalk.green(`下载[${repoName}]模板完成！`));

      process.exit(1);
    } else {
      display.fail(chalk.red(`下载[${repoName}]模板失败：`));
      log(res.err);

      process.exit(0);
    }
  } catch (err) {
    display.fail(chalk.red(`下载[${repoName}]模板失败：`));
    console.error(err);

    process.exit(0);
  }
};
