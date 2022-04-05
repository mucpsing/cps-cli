import path from "path";
import { log } from "console";

import ora from "ora";
import chalk from "chalk";
import inquirer from "inquirer";
import fse from "fs-extra";

import Download from "../utils/gitee-download.mjs";
import { delay, ifDirExists } from "../utils/index.mjs";
import { EMPTY_STRING } from "../env.mjs";
import Config from "./config.mjs";

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
  console.clear();

  const data = Config.orgInfo;
  const org_url = Config.config["org_url"];

  log(`目标组织仓库:  ${chalk.yellow.bold(org_url)}`);
  log(`当前工作目录:  ${chalk.yellow.bold(process.cwd())}`);

  // 如果没有指定仓库，则让用户选择
  if (repoName == "") {
    repoName = await userSelectRepo(Object.keys(data));
  } else {
    if (!data.hasOwnProperty(repoName)) {
      log(chalk.red.bold(`没有找到相应的仓库：${repoName}，请重新选择`));
      repoName = await userSelectRepo(Object.keys(data));
    }
  }

  const repoUrl = `${data[repoName].namespace.html_url}/${repoName}`;
  const dest = path.join(process.cwd(), repoName);

  await ifDirExists(dest);

  try {
    const res = await Download(repoUrl, dest, { clone: true });
    console.log("res: ", res);

    if (res.success) {
      log(chalk.green(`下载[${repoName}]模板完成！`));

      process.exit(1);
    } else {
      log(chalk.red(`下载[${repoName}]模板失败：`));
      log(res.err);

      process.exit(0);
    }
  } catch (err) {
    log(chalk.red(`下载[${repoName}]模板失败：`));
    console.error(err);

    process.exit(0);
  }
};
