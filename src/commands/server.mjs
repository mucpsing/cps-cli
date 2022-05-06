import { log } from "console";
import chalk from "chalk";
import { serverStart } from "../utils/server.mjs";

export default async ctx => {
  const config = ctx.configManager.config["upload"];
  const port = config.server["port"] || ctx.pkg.config["port"];
  const cwd = config["local"]["path"];

  log(chalk.bold.green(`start local server at port:${port}`));
  await serverStart({ staticPath: cwd, port });
};
