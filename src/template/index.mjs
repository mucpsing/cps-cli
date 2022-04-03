import path from "path";
import { log } from "console";

import ora from "ora";
import chalk from "chalk";
import inquirer from "inquirer";
import fse from "fs-extra";

import { getOrgInfo } from "../utils/gitee-api.mjs";
import download from "../utils/gitee-download.mjs";
import { delay, ifDirExists } from "../utils/index.mjs";
import { EMPTY_STRING } from "../env.mjs";

const ORG_NAME = "cps-cli-template";

export default async (repoName = EMPTY_STRING) => {
  console.clear();

  const displayMsg = ora({ text: "获取远程数据中..." });
  let answer;

  displayMsg.start();

  await delay(1000);

  const { success, data, url, err } = await getOrgInfo(ORG_NAME);

  if (!success) {
    displayMsg.text = chalk.red("获取远程数据失败！");
    displayMsg.fail(err);

    process.exit(0);
  }

  displayMsg.succeed(chalk.green("获取远程数据成功！"));

  log(`当前组织仓库:  ${chalk.yellow.bold(url)}`);
  log(`当前目标目录:  ${chalk.yellow.bold(process.cwd())}`);

  // 没有输入则让用户选择
  if (repoName == "") {
    answer = await inquirer.prompt([
      {
        name: "res",
        type: "rawlist",
        message: chalk.bgCyan("选择需要的项目模板："),
        choices: Object.keys(data),
        default: 0,
      },
    ]);

    repoName = answer["res"];
  }

  if (!data.hasOwnProperty(repoName)) log(chalk.red.bold(`sorry, 不支持当前指令${repoName}`));

  const repoUrl = `${data[repoName].namespace.html_url}/${repoName}`;
  const dest = path.join(process.cwd(), repoName);

  await ifDirExists(dest);

  try {
    const res = await download(repoUrl, dest, { clone: true });
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
