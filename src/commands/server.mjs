import { log } from "console";

import chalk from "chalk";
import ora from "ora";

import { serverStart } from "../utils/server.mjs";

export default async ctx => {
  const config = ctx.configManager.getConfig("upload");
  const port = config.server["port"] || ctx.pkg.config["port"];
  const cwd = config["path"];

  const display = ora();

  display.start(chalk.bold.red("获取仓库最新数据...\n"));
  let res = await ctx.utils.shell(["git", "add", ".", "&", "git", "commit", "-m", "cps-cli-pull", "&", "git", "pull", "origin", "master"], {
    cwd,
  });

  console.log(res.res || res.err);

  display.succeed(chalk.bold.green(`start local server at port:${port}`));
  await serverStart({ staticPath: cwd, port });
};
