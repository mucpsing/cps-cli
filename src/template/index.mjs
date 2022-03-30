import chalk from "chalk";
import { log } from "console";
import inquirer from "inquirer";
import git from "./git.mjs";
import ora from "ora";
import { getOrgInfo } from "../utils/gitee.mjs";
import fsp from "fs/promises";

const COMMAND = "template";
const ORG_NAME = "cps-cli-template";
const URL_GET_ORG = `https://gitee.com/api/v5/orgs/${ORG_NAME}/repos`;

async function delay(time) {
  await new Promise(resolve => setTimeout(resolve, time));
}

async function user_select(selection) {
  // 生成选项
  let answer = await inquirer.prompt([
    {
      type: "list",
      name: COMMAND,
      message: chalk.bgCyan("选择需要的项目模板："),
      choices: selection,
      default: 0,
    },
  ]);

  return answer[COMMAND];
}

export default async (input = undefined) => {
  const spinnerDiscardingStdin = ora({
    text: "获取远程数据中...",
  });

  spinnerDiscardingStdin.start();

  const { res, data } = await getOrgInfo(URL_GET_ORG);
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

  if (!templateHandler.hasOwnProperty(input)) log(chalk.hex("res").bold(`sorry, 不支持当前指令${input}`));

  const repo_name = input;
  const repo_url = templateHandler[input].url;
  const target_path = process.cwd();

  log(`当前选择的选择： ${repo_name}`);
  log(`目标仓库路径：${repo_url}`);

  // 创建临时目录
  try {
    const dir = await fsp.mkdtemp(path.join(os.tmpdir(), "cps@cli-tempalte--"));
  } catch (err) {
    console.log("无法创建临时目录");
    console.log(err);
    return;
  }

  // 将仓库文件clone到临时目录

  // 如果成功，将临时目录除了.git文件，其他复制到工作目录
};
