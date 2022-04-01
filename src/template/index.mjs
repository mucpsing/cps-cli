import chalk from "chalk";
import { log } from "console";
import inquirer from "inquirer";
import ora from "ora";
import { getOrgInfo } from "../utils/gitee-api.mjs";
import download from "../utils/gitee-download.mjs";
import { delay } from "../utils/index.mjs";

import fsp from "fs/promises";
import fse from "fs-extra";
import path from "path";
import os from "os";

const COMMAND_NAME = "template";
const ORG_NAME = "cps-cli-template";
const ORG_URL = `https://gitee.com/api/v5/orgs/${ORG_NAME}/repos`;

async function user_select(selection) {
  // 生成选项
  let answer = await inquirer.prompt([
    {
      type: "list",
      name: COMMAND_NAME,
      message: chalk.bgCyan("选择需要的项目模板："),
      choices: selection,
      default: 0,
    },
  ]);

  return answer[COMMAND_NAME];
}

export default async (input = undefined) => {
  const spinnerDiscardingStdin = ora({ text: "获取远程数据中..." });

  spinnerDiscardingStdin.start();

  const { res, data } = await getOrgInfo(ORG_URL);
  if (!res) {
    spinnerDiscardingStdin.text = chalk.red("获取远程数据失败！");
    await delay(1000);
    spinnerDiscardingStdin.fail(err);
    return;
  }

  spinnerDiscardingStdin.succeed(chalk.green("获取远程数据成功！"));

  const templateHandler = data;
  const templateSelection = Object.keys(templateHandler);

  // 没有输入则让用户选择
  if (!input) input = await user_select(templateSelection);
  console.log("input: ", input);

  if (!templateHandler.hasOwnProperty(input)) log(chalk.hex("res").bold(`sorry, 不支持当前指令${input}`));

  const repoName = input;
  const repoUrl = templateHandler[input].html_url;

  // 创建临时目录
  try {
    const temDir = await fsp.mkdtemp(path.join(os.tmpdir(), "cps@cli-tempalte--"));
    const res = await download(repoUrl, temDir, { clone: true });

    console.log("dir: ", temDir);
    console.log("res: ", res);

    await delay();

    // await fse.copyFileSync(temDir, )

    const dest = path.join(process.cwd(), input);
    console.log("dest: ", dest);
    const ret = fse.copySync(temDir, dest);
    console.log("ret: ", ret);

    // fse.removeSync(temDir);

    // const dirName = path.dirname();
  } catch (err) {
    console.log("出错了: ");
    console.error(err);
    return;
  }

  // 将仓库文件clone到临时目录

  // 如果成功，将临时目录除了.git文件，其他复制到工作目录
};
